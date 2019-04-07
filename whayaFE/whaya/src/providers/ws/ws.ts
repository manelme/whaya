import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the WsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class ChatMessage {
  messageId: string;
  userSocketId: string;
  userAvatar: string;
  userName: string;
  userEmail: string;
  toSocketId: string;
  time: number | string;
  message: string;
  status: string;
  fromEmail?: string;
}

export class UserInfo {
  SocketId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

@Injectable()
export class WsProvider {

  constructor(public http: Http, private socket: Socket) {
    console.log('Hello WsProvider Provider');
  }

  sendConnection(email, name, friends){
    this.socket.connect();
    this.socket.emit('connected', { email: email, name: name});
    friends.forEach(element => {
      this.socket.emit('addConnectionFriend',{'friend': element.email});
    });

  }

  sendPulseConnected(friends){
    
    friends.forEach(element => {
      this.socket.emit('addConnectionFriend',{'friend': element.email});
    });

  }

  sendPosition(email, latitude, longitude, friend) {
    this.socket.emit('sendPosition', { email: email, latitude:latitude, longitude: longitude, friend: friend });
  }
  sendFriendship(fromEmail, toEmail, name){
    
    this.socket.emit('requestFriendship', {fromEmail: fromEmail, toEmail: toEmail, name: name})
  }
  sendMessage(fromEmail, socketIdTo, message){
    this.socket.emit('sendMessage', {fromEmail: fromEmail, socketIdTo: socketIdTo, message: message})
  }

  acceptFriendship(fromEmail, toEmail, name){
    console.log('wee3');
    this.socket.emit('acceptedFriendship', {fromEmail: fromEmail, toEmail: toEmail, name: name})
  }
  
  getUserConnected(){
    var observableUserConnections = new Observable(observerUserConnections => {
      this.socket.on('userConnected', (dataUserConnections) => {
        observerUserConnections.next(dataUserConnections);
      });
    })
    return observableUserConnections;
  }

  getPosition() {
    var observablePosition = new Observable(observerPosition => {
      this.socket.on('updatePosition', (dataPosition) => {
        observerPosition.next(dataPosition);
      });
    })
    return observablePosition;
  }
 
  getUsers() {
    var observableUsers = new Observable(observerUsers => {
      this.socket.on('users-changed', (dataUsers) => {
        observerUsers.next(dataUsers);
      });
    });
    return observableUsers;
  }
  getDisconnected(){
    var observableUsers = new Observable(observerUsers => {
      this.socket.on('userDisconnected', (dataUsers) => {
        observerUsers.next(dataUsers);
      });
    });
    return observableUsers;
  }
  getRequestedFrienships(){
    var observableFrienships = new Observable(observerFrienships => {
      this.socket.on('requestedFriendship', (data) => {
        observerFrienships.next(data);
      });
    });
    return observableFrienships;
  }
  getAcceptedFriendships(){
    var observableFrienships = new Observable(observerFrienships => {
      this.socket.on('acceptedFriendship', (data) => {
        observerFrienships.next(data);
      });
    });
    return observableFrienships;
  }
  getMessage(){
    var observableMessage = new Observable(observerMessage => {
      this.socket.on('getMessage', (data) => {
        observerMessage.next(data);
      });
    });
    return observableMessage;
  }
  disconnect(friends){
    console.log('pirula');
    friends.forEach(element => {
      this.socket.emit('disconnect',{'friend': element.email});
    });
    this.socket.disconnect();
  }

}
