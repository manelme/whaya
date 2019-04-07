import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { WsProvider, UserInfo } from '../../providers/ws/ws';
import { NeoServiceProvider } from '../../providers/neo-service/neo-service';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  currentUser: any = {};
  friends: any;
  contacts = 'accepted';

  connectedFriends: any = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private ws: WsProvider, private storage: Storage, private neoService: NeoServiceProvider, private toastController: ToastController) {

  }

  ionViewDidEnter(){
    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
        this.neoService.getFriends(this.currentUser.id).then((response: any) => {
          var friends = response.json();
          this.friends = friends;
          this.ws.sendPulseConnected(friends.Accepted);
        })
      })
    })
  }

  ionViewWillEnter() {

    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
        this.currentUser = data;
        this.currentUser.position = {};
        this.neoService.getFriends(this.currentUser.id).then((response: any) => {
          var friends = response.json();
          this.friends = friends;
          //this.ws.sendPulseConnected(friends.Accepted);
        
          this.ws.getUserConnected().subscribe((userConnected: any) => {
            this.friends.Accepted.forEach(element => {
              let aux: any = {};
              if (userConnected.email == element.email) {
                aux.email = userConnected.email;
                aux.socketId = userConnected.socketId;
                aux.name = userConnected.name;
                aux.avatar = element.avatar;
                aux.unread = false;
                if (this.lookForDuplicates(element.email)) {
                  console.log("Duplicate");
                  this.connectedFriends.push(aux);
                }
                else {
                  this.connectedFriends.push(aux);
                }
              }
            })


          }, (err) => {
            console.log(err);
          });
          this.ws
            .getMessage()
            .subscribe((res: any) => {
              console.log("entra");
              this.connectedFriends.forEach(element => {
                if (res.fromEmail == element.email) {
                  element.unread = true;
                  console.log(element.unread);
                }
              });
            }, (err) => {
              console.log(err);
            })
          this.ws.getDisconnected().subscribe((userDisconnected: any) => {


            for (var i = 0; i < this.connectedFriends.length; i++) {
              if (userDisconnected.email == this.connectedFriends[i].email) {
                this.connectedFriends.splice(i, 1);
                i--;
              }
            }

          }), (err) => {
            console.log(err);
          }
        }), (err) => {
          console.log(err);
        }
      }), (err) => {
        console.log(err);
      }
    });


  }

  sendFrienship() {

    let prompt = this.alertCtrl.create({
      title: 'Add Friend',
      message: "Enter the email of the person you want to add",
      inputs: [
        {
          name: 'email',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            this.storage.ready().then(() => {
              this.storage.get("currentUser").then((data2: any) => {
                if (data.email != data2.email) {
                  this.neoService.getUserByEmail(data.email).then((user) => {
                    if (user) {
                      this.storage.get("requestedFriends").then((requestedFriends: string[]) => {
                        console.log(JSON.stringify(requestedFriends));
                        if (requestedFriends !== null) {
                          let requestedFriendAux = requestedFriends;
                          if (requestedFriendAux.indexOf(data.email) > -1) {
                            let toast = this.toastController.create({
                              message: 'You already tried to add ' + data.email + ' to your contacts list',
                              duration: 5000,
                              cssClass: "toast-info",
                            });
                            toast.present();
                          } else {
                            if (this.isFriend(data.email)) {
                              let toast = this.toastController.create({
                                message: data.email + ' is already on your contacts list',
                                duration: 5000,
                                cssClass: "toast-fail",
                              });
                              toast.present();
                            } else {
                              this.neoService.createFriendship(data2.id, data.email).then(data3 => {
                                this.ws.sendFriendship(data2.email, data.email, data2.name);
                              })
                              let toast = this.toastController.create({
                                message: 'The friendship request was send succesfully',
                                duration: 5000,
                                cssClass: "toast-success",
                              });
                              toast.present();

                            }

                          }
                        }
                        else {
                          if (this.isFriend(data.email)) {
                            let toast = this.toastController.create({
                              message: data.email + ' is already on your contacts list',
                              duration: 5000,
                              cssClass: "toast-fail",
                            });
                            toast.present();
                          } else {
                            this.neoService.createFriendship(data2.id, data.email).then(data3 => {
                              this.ws.sendFriendship(data2.email, data.email, data2.name);
                            })
                            let toast = this.toastController.create({
                              message: 'The friendship request was send succesfully',
                              duration: 5000,
                              cssClass: "toast-success",
                            });
                            toast.present();

                          }

                        }
                      })
                    }
                    else {
                      let toast = this.toastController.create({
                        message: 'The email is not in our database please try again',
                        duration: 5000,
                        cssClass: "toast-fail",
                      });
                      toast.present();


                    }
                  }, (ERR)=>{
                    let toast = this.toastController.create({
                      message: 'The email is not in our database please try again',
                      duration: 5000,
                      cssClass: "toast-fail",
                    });
                    toast.present();
                  })
                }
                else {
                  let toast = this.toastController.create({
                    message: 'You can not friend yourself',
                    duration: 5000,
                    cssClass: "toast-fail",
                  });
                  toast.present();
                }
              }
                , err => {
                  console.log(err);
                })

            }, (err) => {
              console.log(err);
            }), (err) => {
              console.log(err);
            };
          }
        },]
    })
    prompt.present();

  }
  chat(toUser) {
    toUser.unread = 0;
    console.log(toUser);
    this.navCtrl.push("Chat", { toUser: toUser, currentUser: this.currentUser });
  }
  lookForDuplicates(email: string) {
    console.log("rareMethod");
    for (var i = 0; i < this.connectedFriends.length; i++) {
      if (this.connectedFriends[i].email == email) {
        this.connectedFriends.splice(i, 1);
        i--;
        return true;
      }
    }
    return false;
  }
  isFriend(email: string) {
    console.log("EMAIL:" + email)
    console.log("FRIENDS: " + JSON.stringify(this.friends))
    if (this.friends.Accepted.some(element => {
      if (element.email == email) {
        console.log("MEH1")
        return true;
      }
    })) return true;
    if (this.friends.NonAccepted.some(element => {
      if (element.email == email) {
        console.log("MEH2")
        return true;
      }
    })) return true;
    console.log("MEH3")
    return false;

  }
  loadFriends() {
    this.neoService.getFriends(this.currentUser.id).then((friends: any) => {
      this.friends = friends.json();
    }, (err) => {
      console.log(err);
    })
  }
  accept(toUser){

    this.neoService.acceptFriendship(this.currentUser.id, toUser.email).then(()=>{
      this.ws.acceptFriendship(this.currentUser.email, toUser.email, this.currentUser.name);
      let toast = this.toastController.create({
        message: 'You have accepted '+ toUser.email +' friendship' ,
        duration: 3000,
      });
      toast.present();
      this.navCtrl.setRoot(TabsPage);
      if(this.friends === null || this.friends === undefined){
        console.log("nop");
      }else{
        
        this.ws.disconnect(this.friends.Accepted);
      }
      window.location.reload()

    });
    
  }
}