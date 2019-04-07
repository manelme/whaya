import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ActionSheetController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GeolocProvider } from '../../providers/geoloc/geoloc';
import { NeoServiceProvider } from '../../providers/neo-service/neo-service';
import { MongoServiceProvider } from '../../providers/mongo-service/mongo-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WsProvider } from '../../providers/ws/ws';
import { ModalContentPage } from '../login/login';
import 'rxjs/add/operator/map';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';




declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  meMarker: any;
  mettingMarker:any;
  currentUser: any = {};
  friends: any;
  acceptedFriends: any = [];
  nonAcceptedFriends: any = [];
  connectedFriends: any = [];
  svg: any;


  constructor(public navCtrl: NavController,public modalCtrl:ModalController, private storage: Storage, private geolocProvider: GeolocProvider, private neoService: NeoServiceProvider, private ws: WsProvider, private mongoService: MongoServiceProvider, private authService: AuthServiceProvider, public actionSheetCtrl: ActionSheetController, private toastController: ToastController) {



  }
  ionViewWillEnter() {
    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
       
        this.currentUser = data;
        this.svg = '<?xml version="1.0"?>' +
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="200px" width="200px" viewBox="0 0 200 200">' +
          '<image width="200" height="200" preserveAspectRatio="xMinYMin slice" xlink:href="' + this.currentUser.avatar + '"/>' +
          '<rect x="0" y="0" width="200px" height="200px" stroke="black" stroke-width="5px" fill="none"/>' +
          '</svg>';

        this.currentUser.position = {};
        this.geolocProvider.getUserPosition().then((pos: any) => {

          let meMarkerOptions = {
            icon: { url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(this.svg), scaledSize: new google.maps.Size(40, 40) },
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, this.geolocProvider.addMap(pos.latitude, pos.longitude));
          this.meMarker = this.geolocProvider.addMarker(this.map, pos.latitude, pos.longitude, meMarkerOptions);
          let infoWindow = this.geolocProvider.addContentToMarker("<p>This is your current position !</p>");
          google.maps.event.addListener(this.meMarker, 'click', () => {
            infoWindow.open(this.map, this.meMarker);
          });
          

        }, (err) => {

          console.log("Error Message: ", err);

        });
        this.neoService.getFriends(this.currentUser.id).then((response: any) => {
          var friends = response.json();
          this.friends = friends;
          //this.ws.sendPulseConnected(friends.Accepted);

          this.ws.getUserConnected().subscribe((userConnected: any) => {

            friends.Accepted.forEach(element => {
              let aux: any = {};
              if (userConnected.email == element.email) {
                aux.email = userConnected.email;
                aux.socketId = userConnected.socketId;
                aux.name = userConnected.name;
                aux.avatar = element.avatar;
                if (this.lookForDuplicates(element.email, aux.socketId)) {

                  console.log("Duplicate");
                }
                else {
                  this.connectedFriends.push(aux);

                }
              }
            })
          }, (err) => {
            console.log(err);
          });
          this.ws.getDisconnected().subscribe((userDisconnected: any) => {

            for (var i = 0; i < this.connectedFriends.length; i++) {
              if (userDisconnected.email == this.connectedFriends[i].email) {
                this.connectedFriends[i].marker.setMap(null);
                this.connectedFriends.splice(i, 1);
                i--;
              }
            }

          }, (err) => {
            console.log(err);
          })

          this.geolocProvider.getContinousPosition().subscribe((position: any) => {

            this.currentUser.position.latitude = position.coords.latitude;
            this.currentUser.position.longitude = position.coords.longitude;
            //this.map.setCenter(new google.maps.LatLng(this.currentUser.position.latitude, this.currentUser.position.longitude));
            this.meMarker.setPosition(new google.maps.LatLng(this.currentUser.position.latitude, this.currentUser.position.longitude));
            this.mongoService.savePosition(this.currentUser.email, this.currentUser.position.latitude, this.currentUser.position.longitude);

            this.connectedFriends.forEach(element => {
              this.ws.sendPosition(this.currentUser.email, this.currentUser.position.latitude, this.currentUser.position.longitude, element.socketId);
            });
            //this.ws.sendPosition(this.currentUser.email, this.currentUser.position.latitude, this.currentUser.position.longitude, this.connectedFriends);
          }, (err) => {
            console.log(err);
          });



          this.ws.getPosition().subscribe((userPosition: any) => {
            console.log(JSON.stringify(userPosition))
            this.connectedFriends.forEach(element => {
              if (userPosition.email == element.email) {
                element.position = {};

                let svg = '<?xml version="1.0"?>' +
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="200px" width="200px" viewBox="0 0 200 200">' +
                  '<image width="200" height="200" preserveAspectRatio="xMinYMin slice" xlink:href="' + element.avatar + '"/>' +
                  '<rect x="0" y="0" width="200px" height="200px" stroke="black" stroke-width="5px" fill="none"/>' +
                  '</svg>';

                let markerOptions = {
                  icon: { url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg), scaledSize: new google.maps.Size(40, 40) },
                };

                element.position.latitude = userPosition.latitude;
                element.position.longitude = userPosition.longitude;


                if (typeof element.marker !== 'undefined') {
                  element.marker.setMap(null);

                  element.marker = this.geolocProvider.addMarker(this.map, userPosition.latitude, userPosition.longitude, markerOptions);

                  element.marker.setAnimation(null);

                } else {
                  element.marker = this.geolocProvider.addMarker(this.map, userPosition.latitude, userPosition.longitude, markerOptions);
                }
              }
            })

          }, (err) => {
            console.log(err);
          });



        }, (err) => {
          console.log(err);
          this.storage.get('currentUserAuth').then(data => {
            this.authService.refreshToken(data.refresh_token);
            console.log(data);
          })

        })
      }, (err) => {
        console.log(err);
      })
    })


  }

  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
        this.neoService.getUserByEmail(this.currentUser.email).then((userData: Response)=>{
          let dataAux: any = userData.json();
          this.storage.set("currentUser", dataAux);
          for(var i = 0; i<dataAux.places.length;i++){
            
            if(Date.parse(dataAux.places[i].date)>Date.now()){
              this.geolocProvider.addMettingMarker(this.map, dataAux.places[i].latitude, dataAux.places[i].longitude, dataAux.places[i]);
            }
          }

        })
        this.neoService.getFriends(this.currentUser.id).then((response: any) => {
          var friends = response.json();
          this.friends = friends;
          this.ws.sendPulseConnected(friends.Accepted);
        })
      })
    })
  }

  lookForDuplicates(email: string, socketId: string) {
    console.log("rareMethod");
    var aux = false;
    for (var i = 0; i < this.connectedFriends.length; i++) {
      if (this.connectedFriends[i].email == email) {
        this.connectedFriends[i].socketId = socketId;
        aux = true;
      }
    }
    return aux;
  }
  showSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Menu',
      buttons: [
        {
          text: 'Create a Meeting',
          handler: () => {
            console.log('Create a meeting press');
            this.mettingMarker = this.geolocProvider.addInteractiveMettingMarker(this.map, this.currentUser.position.latitude + 0.001,this.currentUser.position.longitude + 0.001);
            this.markerEvents(this.mettingMarker);

            
            // this.neoService.createPlace(this.currentUser.id, 'Ual', 36.829322, -2.404461, Date.now().toString()).then((response:any) =>{
            //   console.log(response);
            //   this.storage.set("currentUser", response.json());
            // });   
          }
        }, {
          text: 'Profile',
          handler: () => {
            console.log('Configuration clicked');
            this.navCtrl.push(ModalContentPage);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  loadFriends() {
    this.neoService.getFriends(this.currentUser.id).then((friends: any) => {
      this.friends = friends.json();
    }, (err) => {
      console.log(err);
    })
  }
  
  markerEvents(markerobject){
    var self=this;
    google.maps.event.addListener(markerobject, 'dragend', function(evt){
        console.log('Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3));
        self.createMettingModal(evt.latLng.lat().toFixed(3), evt.latLng.lng().toFixed(3));
    });
  }
  createMettingModal(lat, lng){
    let meetingModal = this.modalCtrl.create('MeetingModalPage',{'latitude': lat, 'longitude':lng});
        meetingModal.present();
        meetingModal.onDidDismiss((data) =>{
          if(data != null){
            console.log(data);
            this.neoService.createPlace(this.currentUser.id, data.name, data.latitude, data.longitude, data.date).then((response:any) =>{
              console.log(response);
              let toast = this.toastController.create({
                message: 'A new meeting was created',
                duration: 3000,
              });
              toast.present();
              this.storage.set("currentUser", response.json());
              this.mettingMarker.setMap(null);
              this.mettingMarker = this.geolocProvider.addMettingMarker(this.map, data.latitude, data.longitude, data);
            }); 
          }else{
            this.mettingMarker.setMap(null);
             
          }
          
        })

  } 

}

