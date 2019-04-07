import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';
import { WsProvider, ChatMessage, UserInfo } from '../../providers/ws/ws';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class Chat {

    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;

    currentUser: any = {};
    friends: any = [];
    acceptedFriends: any = [];
    nonAcceptedFriends: any = [];
    connectedFriends: any = [];

    constructor(public navParams: NavParams,
                public ws: WsProvider,
                public events: Events, public navCtrl: NavController, public storage: Storage) {
        

        this.toUser = {
            SocketId: navParams.data.toUser.socketId,
            name: navParams.data.toUser.name,
            email: navParams.data.toUser.email,
            avatar: navParams.data.toUser.avatar
        };
        this.user = {
          SocketId: 'yo',
          name: navParams.data.currentUser.name,
          email: navParams.data.currentUser.email,
          avatar: navParams.data.currentUser.avatar
        }
        console.log(this.toUser);
        
        
        
    }

    ionViewWillLeave() {
        // unsubscribe
        this.events.unsubscribe('chat:received');


    }

    ionViewDidEnter() {
        //get message list
        this.storage.ready().then(() => {
            this.storage.get("messages_"+this.toUser.email).then((data: any) => {
                if(data){
                    data.forEach(element => {
                        if(element.fromEmail == this.toUser.email){
                            let newMsg: ChatMessage = {
                                messageId: element.date.toString(),
                                userSocketId: this.toUser.SocketId,
                                userAvatar: this.toUser.avatar,
                                userName: this.toUser.name,
                                userEmail: this.toUser.email,
                                toSocketId: this.toUser.SocketId,
                                time: element.date,
                                message: element.message,
                                status: 'recived'
                              };
                              this.msgList.push(newMsg);
                        }else{
                            let newMsg: ChatMessage = {
                                messageId: element.messageId,
                                userSocketId: element.userSocketId,
                                userAvatar: element.userAvatar,
                                userName: element.userName,
                                userEmail: element.userEmail,
                                toSocketId: element.toSocketId,
                                time: element.time,
                                message: element.message,
                                status: 'recived'
                            };
                            this.msgList.push(newMsg);
                        }
                    });
                    this.scrollToBottom();
                }
            })
        })
        this.getMsg();

        // Subscribe to received  new message events
        this.events.subscribe('chat:received', msg => {
            this.pushNewMsg(msg);
        })
        this.ws.getDisconnected().subscribe((userDisconnected: any) => {
            if(this.toUser.email == userDisconnected.email){
                this.navCtrl.popToRoot();
            }
        })
    }

    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    getMsg() {
        
        this.ws
        .getMessage()
        .subscribe((res: ChatMessage) => {
            console.log("mensaje recibido");
            console.log(res);
            let newMsg: ChatMessage = {
              messageId: Date.now().toString(),
              userSocketId: this.toUser.SocketId,
              userAvatar: this.toUser.avatar,
              userName: this.toUser.name,
              userEmail: this.toUser.email,
              toSocketId: this.toUser.SocketId,
              time: Date.now(),
              message: res.message,
              status: 'recived'
            };
            this.msgList.push(newMsg);

            this.scrollToBottom();
        }, (err)=>{
          console.log(err);
        })
        
    }

    /**
     * @name sendMsg
     */
    sendMsg() {
        if (!this.editorMsg.trim()) return;

        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userSocketId: this.user.SocketId,
            userAvatar: this.user.avatar,
            userName: this.user.name,
            fromEmail: this.user.email,
            userEmail: this.user.email,
            toSocketId: this.toUser.SocketId,
            time: Date.now(),
            message: this.editorMsg,
            status: 'recived'
        };
        this.saveMessage(newMsg)
        this.pushNewMsg(newMsg);
        this.editorMsg = '';

        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }

        this.ws.sendMessage(newMsg.userEmail, newMsg.toSocketId, newMsg.message);
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        const userId = this.user.SocketId,
              toUserId = this.toUser.SocketId;
        // Verify user relationships
        if (msg.userSocketId === userId && msg.toSocketId === toUserId) {
            this.msgList.push(msg);
        } else if (msg.toSocketId === userId && msg.userSocketId === toUserId) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }
    saveMessage(msg: ChatMessage){
        this.storage.ready().then(() => {
            this.storage.get("messages_"+this.toUser.email).then((data) => {
              if(data){
                data.push(msg)
                this.storage.set("messages_"+this.toUser.email, data);
              }else{
                let aux = new Array<{}>();
                aux.push(msg); 
                this.storage.set("messages_"+this.toUser.email, aux);

              }
            }, (err)=>{
              
            })
        })
    }
    scrollToBottom() {
        if(this.content._scroll){
            setTimeout(() => {
                
                    this.content.scrollToBottom(0);
                
            }, 400)
        }
        
    }
}
