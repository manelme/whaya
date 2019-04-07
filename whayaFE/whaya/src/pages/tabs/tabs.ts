import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { MeetingsPage } from '../meetings/meetings'

import { NeoServiceProvider } from '../../providers/neo-service/neo-service';
import { WsProvider } from '../../providers/ws/ws';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab3Root = MeetingsPage;
  
  contactBadge: number;

  currentUser: any = {};
  friends: any;

  constructor(private storage: Storage,public navCtrl: NavController, private ws: WsProvider, public alertCtrl: AlertController, private neoService: NeoServiceProvider, private toastController:ToastController) {
    console.log("tabsLoaded")
    this.contactBadge = 0;
    
   
  }

  ionViewDidEnter(){
    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
        this.currentUser = data;
        this.neoService.getFriends(this.currentUser.id).then((response: any) => {
          var friends = response.json();
          this.friends = friends;
          this.ws.sendConnection(this.currentUser.email, this.currentUser.name, friends.Accepted);
        })
      })
    
    })
    this.ws.getRequestedFrienships().subscribe((requestedFriends: any)=>{
      
      
      console.log(JSON.stringify(requestedFriends));
      let alert = this.alertCtrl.create({
        title: 'New Friend!',
        message: requestedFriends.name+' with email '+ requestedFriends.fromEmail+' wants to be your friend',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
                  this.neoService.acceptFriendship(this.currentUser.id, requestedFriends.fromEmail).then(()=>{
                    this.ws.acceptFriendship(this.currentUser.email, requestedFriends.fromEmail, this.currentUser.name);
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
        ]
      });
      alert.present();

    },(err)=>{
      console.log(err);
    });
    this.ws.getAcceptedFriendships().subscribe((data: any) =>{
      this.loadFriends();
      let toast = this.toastController.create({
        message: data.fromEmail +' accepted your friendship request' ,
        duration: 3000,
      });
      toast.present();
      //this.ws.sendPulseConnected(this.friends.Accepted);
      this.navCtrl.setRoot(TabsPage);
      if(this.friends === null || this.friends === undefined){
        console.log("nop");
      }else{
        
        this.ws.disconnect(this.friends.Accepted);
      }
      window.location.reload()

    })
    this.ws
    .getMessage()
    .subscribe((res: any) => {
        
      this.storage.ready().then(() => {
        this.storage.get("messages_"+res.fromEmail).then((data) => {
          console.log("entra");
          if(data){
            res.date = Date.now()
            data.push(res)
            this.storage.set("messages_"+res.fromEmail, data);
            this.contactBadge++;
          }else{
            let aux = new Array<{}>();
            res.date = Date.now()
            aux.push(res); 
            this.storage.set("messages_"+res.fromEmail, aux);
            this.contactBadge++;
          }
        }, (err)=>{
          
        })
    }, (err)=>{
      console.log(err);
    })
  });
  }
  contactPage(){
    this.contactBadge = 0;
    
  }
  loadFriends(){
    this.neoService.getFriends(this.currentUser.id).then((friends: any) => {
      this.friends = friends.json();
    }, (err)=>{
      console.log(err);
    })
  }
  ionViewDidUnload(){
    if(this.friends === null || this.friends === undefined){
      console.log("nop");
    }else{
      
      this.ws.disconnect(this.friends.Accepted);
    }
    
    
  }

}
