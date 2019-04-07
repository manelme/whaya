var express = require('express');

var app = express();
app.set('port', process.env.PORT || 9000);

var request = require('request');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = app.get('port');

app.use(express.static('public'));

server.listen(port, function () {
    console.log("Server listening on: http://localhost:%s", port);
});

var users = [];

io.sockets.on('connection', function (socket) {
    
    socket.user = {};
    socket.user.email = '';
    socket.user.friends = [];
    socket.user.socketId = socket.id;


    socket.on('sendPosition', function(data){
        
        var newPosition = {'email': data.email, 'latitude': data.latitude, 'longitude': data.longitude};
        request.post('http://localhost:8000/locations', {form:newPosition});

        var len = 0;
        for(var i=0, len=data.friends.length; i<len; i++ ){
            socket.to(data.friends.socketIdTo).emit("updatePosition", newPosition);
        }

    });

    socket.on('sendChat', function (data) {
        socket.to(data.socketIdTo).emit("updateChat", {"fromEmail":socket.user.email, "message":data.message});
    });

    // Provisional
    socket.on('sendMeeting', function (data) {
        socket.to(data.socketIdTo).emit("recibeMeeting", {"fromEmail":socket.user.email, "message":data.message, "meetingDate": data.meetingDate, "place":data.place});
    });

    // Provisional
    socket.on('acceptMeeting', function (data) {
        if(data.accepted==true){
            socket.to(data.socketIdTo).emit("acceptedMeeting", {"fromEmail":socket.user.email, "accepted": true, "meetingDate": data.meetingDate, "place":data.place});
        }else{
            socket.to(data.socketIdTo).emit("acceptedMeeting", {"fromEmail":socket.user.email, "accepted": false, "meetingDate": data.meetingDate, "place":data.place});
        }
        
    });

    socket.on('connection', function (data) {

        var user = {};
        user.email=data.email;
        user.socketId=socket.id;
        user.friends=data.friends;
        socket.user = user;
        users.push(user);
        
        var len = 0;
        for(var i=0, len=data.friends.length; i<len; i++ ) {
            var len2 = 0;
            for(var j=0, len2=users.length; j<len2; j++ ){
                if(data.friends[i]==users[j].email){
                    socket.to(users[j].socketId).emit("userConnected", {"email":data.email, "socketId":user.socketId});
                    socket.emit("userConnected", {"email":users[j].email, "socketId":users[j].socketId});
                }
            }
        }
    });

    socket.on('disconnect', function () {
        for(var i=0, len=socket.user.friends.length; i<len; ++i ) {
            var len2 = 0;
            for(var j=0, len2=users.length; j<len2; ++j ){
                if(socket.user.friends[i]==users[j].email){
                    socket.to(users[j].socketId).emit("userDisconnected", {"email":socket.user.email, "socketId":socket.user.socketId});
                }
            }
        }
        delete users[socket.user];
    });
});