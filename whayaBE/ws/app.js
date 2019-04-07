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

function User(email, name, socketId) {
    this.email = email;
    this.name = name;
    this.socketId = socketId;
}
var users = [];


io.sockets.on('connection', function (socket) {


    socket.on('sendPosition', function (data) {

        var newPosition = { 'email': data.email, 'latitude': data.latitude, 'longitude': data.longitude };
        if (typeof data.friend !== 'undefined') {
            socket.to(data.friend).emit("updatePosition", newPosition);
            console.log('sendPosition:' + data.email + ' ', data.friend);

        }

    });
    socket.on('requestFriendship', function (data) {
        console.log("wee" + JSON.stringify(data));
        if (typeof data.fromEmail !== 'undefined' && typeof data.toEmail !== 'undefined' && data.name !== 'undefined') {
            var newFriendship = { 'fromEmail': data.fromEmail, 'toEmail': data.toEmail, 'name': data.name };

            for (var i = 0; i < users.length; i++) {
                if (users[i].email == data.toEmail) {
                    socket.to(users[i].socketId).emit("requestedFriendship", newFriendship);
                    console.log("requestedFriendship:");
                }

            }
        }

    });

    socket.on('acceptedFriendship', function (data) {
        console.log("wee2" + JSON.stringify(data));
        if (typeof data.fromEmail !== 'undefined' && typeof data.toEmail !== 'undefined' && data.name !== 'undefined') {
            var newFriendship = { 'fromEmail': data.fromEmail, 'toEmail': data.toEmail, 'name': data.name };

            for (var i = 0; i < users.length; i++) {
                if (users[i].email == data.toEmail) {
                    socket.to(users[i].socketId).emit("acceptedFriendship", newFriendship);
                    socket.emit("acceptedFriendship", { 'fromEmail': data.toEmail, 'toEmail': users[i].email, 'name': users[i].name });
                    socket.to(users[i].socketId).emit("userConnected", { 'email': socket.user.email, 'name': socket.user.name, 'socketId': socket.id });
                    socket.emit("userConnected", { 'email': users[i].email, 'name': users[i].name, 'socketId': users[i].socketId });
                }
            }
        }

    });

    socket.on('sendMessage', function (data) {
        console.log('sendMessage:', data.message);
        socket.to(data.socketIdTo).emit("getMessage", { "fromEmail": socket.user.email, "message": data.message });
    });

    // Provisional
    socket.on('sendMeeting', function (data) {
        console.log('sendMeeting:', data.place);
        socket.to(data.socketIdTo).emit("recibeMeeting", { "fromEmail": socket.user.email, "message": data.message, "meetingDate": data.meetingDate, "place": data.place });
    });

    // Provisional
    socket.on('acceptMeeting', function (data) {
        if (data.accepted == true) {
            socket.to(data.socketId).emit("acceptedMeeting", { "fromEmail": socket.user.email, "accepted": true, "meetingDate": data.meetingDate, "place": data.place });
        } else {
            socket.to(data.socketId).emit("acceptedMeeting", { "fromEmail": socket.user.email, "accepted": false, "meetingDate": data.meetingDate, "place": data.place });
        }
        console.log('acceptMeeting:', data.place);
    });

    socket.on('connected', function (data) {


        socket.user = new User(data.email, data.name, socket.id);
        users.push(socket.user);
        console.log('users:' + JSON.stringify(users))

    });

    socket.on('addConnectionFriend', function (data) {

        for (var i = 0; i < users.length; i++) {

            if (data.friend == users[i].email) {
                socket.to(users[i].socketId).emit("userConnected", { 'email': socket.user.email, 'name': socket.user.name, 'socketId': socket.id });
                socket.emit("userConnected", { 'email': users[i].email, 'name': users[i].name, 'socketId': users[i].socketId });
            }
        }
    });

    socket.on('pulseConnected', function (data) {

        for (var i = 0; i < users.length; i++) {

            if (data.friend == users[i].email) {
                socket.emit("userConnected", { 'email': users[i].email, 'name': users[i].name, 'socketId': users[i].socketId });
            }
        }
    });

    socket.on('disconnect', function () {
        console.log('disconnect:');
        var len = 0;
        if(socket.user.email != undefined){
            socket.broadcast.emit('userDisconnected', { 'email': socket.user.email, 'name': socket.user.name, 'socketId': socket.id });
        for (var i = 0 ; i < users.length; i++) {
            
                if (socket.user.email == users[i].email) {
                    users.splice(i, 1);
                    i--;

                }
            
        }
        }
        
    })
});
