import { Component,Renderer } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { GeolocProvider } from '../../providers/geoloc/geoloc';

/**
 * Generated class for the MeetingModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meeting-modal',
  templateUrl: 'meeting-modal.html',
})
export class MeetingModalPage {

  latitude: any;
  longitude: any;
  image: any;
  address: any;
  myDate: string;
  name: string;
  save = false;
  apiKey = 'AIzaSyBStU_iZL7JFBM8FU4xOT9P2SqTvRPqt8k';
  constructor(private view: ViewController,public renderer: Renderer, private navParams: NavParams, private geoloc: GeolocProvider) {
    this.renderer.setElementClass(view.pageRef().nativeElement, 'my-popup', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingModalPage');
    this.latitude=this.navParams.get('latitude')
    this.longitude=this.navParams.get('longitude');
    this.image = this.geoloc.getStaticImageFrom(this.latitude, this.longitude);
    this.geoloc.getAddress(this.latitude, this.longitude).then((data:any)=>{
      this.address=data.results[0].formatted_address;
      console.log(data.results[0].formatted_address);
      this.myDate= new Date().toISOString();
    }, (error)=>{
      console.log(error);
    });
    
  }
  closeModal(){
    this.view.dismiss();
  }
  saveMeeting(){
    this.save=true;
    let data = {longitude:this.longitude,latitude:this.latitude,address:this.address,date:this.myDate,name:this.name};
    this.view.dismiss(data);
  }

}
