import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocProvider } from '../../providers/geoloc/geoloc';
import { NeoServiceProvider } from '../../providers/neo-service/neo-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MeetingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meetings',
  templateUrl: 'meetings.html',
})
export class MeetingsPage {

  @ViewChild('ranger') ranger: ElementRef;
  value = 200;
  options:any;
  currentUser: any = {};
  pos:any = {};
  myMeetings:any;
  friendsMeetings: any;
  friendsMeetingsAux: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private geolocProvider: GeolocProvider, private neoService: NeoServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingsPage');
  }

  ionViewDidEnter(){
    this.options = "mine";
    this.myMeetings = {future: [],past:[]};
    this.storage.ready().then(() => {
      this.storage.get("currentUser").then((data: any) => {
        
        this.currentUser = data;
        this.neoService.getUserByEmail(this.currentUser.email).then((userData: Response)=>{
          let dataAux: any = userData.json();
          this.currentUser = dataAux;
          this.geolocProvider.getUserPosition().then((pos: any) => {

            this.currentUser.position = pos;
            this.showClose();
  
          }, (err) => {
  
            console.log("Error Message: ", err);
  
          });
        })
        
        
      })
    })
  }
  getAddress(i, friends?){
    if(friends){
      this.geolocProvider.getAddress(this.friendsMeetingsAux[i].latitude, this.friendsMeetingsAux[i].longitude).then((data2:any)=>{
      
          this.friendsMeetingsAux[i].address = data2.results[0].formatted_address;
        
      }, (error)=>{
        console.log(error);
      });
    }else{
      this.geolocProvider.getAddress(this.currentUser.places[i].latitude, this.currentUser.places[i].longitude).then((data2:any)=>{
      
        this.currentUser.places[i].address = data2.results[0].formatted_address;
        this.currentUser.places[i].generalScore = Math.round(this.currentUser.places[i].generalScore);
      
    }, (error)=>{
      console.log(error);
    });
    }
    
  }
  
  showClose(){
    this.myMeetings = {future: [],past:[]};
    this.friendsMeetings = [];
    this.friendsMeetingsAux = [];
    for(var i = 0; i<this.currentUser.places.length;i++){
      let distance = this.calculateDistance(this.currentUser.places[i].latitude,this.currentUser.places[i].longitude);   
      if(distance < this.value){
        if(Date.parse(this.currentUser.places[i].date)>Date.now()){
      
          this.myMeetings.future.push(this.currentUser.places[i]); 
          this.currentUser.places[i].image = this.geolocProvider.getStaticImageFrom(this.currentUser.places[i].latitude, this.currentUser.places[i].longitude);
          let dateAux = new Date(this.currentUser.places[i].date);
          this.currentUser.places[i].dateLocale= dateAux.toLocaleString();
          this.getAddress(i);
          }else{  
            this.myMeetings.past.push(this.currentUser.places[i]);
            this.currentUser.places[i].image = this.geolocProvider.getStaticImageFrom(this.currentUser.places[i].latitude, this.currentUser.places[i].longitude);
            let dateAux = new Date(this.currentUser.places[i].date);
            this.currentUser.places[i].dateLocale = dateAux.toLocaleString();
            this.getAddress(i);
          }
      }
      
    }

    this.neoService.getClosePlacesFriends(this.currentUser.id,this.currentUser.position.longitude,this.currentUser.position.latitude,this.value/1000).then((data: Response) =>{
      this.friendsMeetingsAux = data.json();

      for(var j = 0; j<this.friendsMeetingsAux.length;j++){
        if (Date.parse(this.friendsMeetingsAux[j].date)>Date.now()){
          this.friendsMeetings.push(this.friendsMeetingsAux[j]);
          this.friendsMeetingsAux[j].image = this.geolocProvider.getStaticImageFrom(this.friendsMeetingsAux[j].latitude, this.friendsMeetingsAux[j].longitude);
          let dateAux = new Date(this.friendsMeetingsAux[j].date);
          this.friendsMeetingsAux[j].dateLocale= dateAux.toLocaleString();
          this.getAddress(j, true)
        }
      }
    });
    
  }
  calculateDistance(latitude,longitude){
    var R = 6371; // km (change this constant to get miles)
    var dLat = (this.currentUser.position.latitude-latitude) * Math.PI / 180;
    var dLon = (this.currentUser.position.longitude-longitude) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(latitude * Math.PI / 180 ) * Math.cos(this.currentUser.position.latitude * Math.PI / 180 ) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return Math.round(d*1000);

  }
  willGo(meetingId, option){

    if(option){
      this.neoService.postScore(5,"Meeting Scored", this.currentUser.id, meetingId);
    }else{
      this.neoService.postScore(0,"Meeting Scored", this.currentUser.id, meetingId);
    }

  }

}
