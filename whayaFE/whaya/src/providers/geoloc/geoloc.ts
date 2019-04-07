import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the GeolocProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var google;

@Injectable()
export class GeolocProvider {
  
  currentPos : Geoposition;
  apiKey = 'AIzaSyBStU_iZL7JFBM8FU4xOT9P2SqTvRPqt8k';

  constructor(public http: Http, public geolocation: Geolocation) {
    console.log('Hello GeolocProvider Provider');
  }
  
  addMap(lat,long){
    
        let latLng = new google.maps.LatLng(lat, long);
    
        let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID
        }
        return mapOptions;
    
  }
  addMarker(map, lat, long, markerOptions){
    
        let marker = new google.maps.Marker({
        map: map,
        label: markerOptions.label,
        icon: markerOptions.icon,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, long)
        });
        return marker;
    
  }
  addMettingMarker(map, lat, long, data){
    let marker = new google.maps.Marker({
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, long)
      });
      let dateAux = new Date(data.date);
      let dateLocale= dateAux.toLocaleString();
      let infoWindow = this.addContentToMarker("<b>"+data.name+"</b><p>Scheduled meeting at "+dateLocale+"</p>");
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
      return marker;
      
  }
  addInteractiveMettingMarker(map, lat, long){
    let marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, long)
      });
      return marker;
  }

  addContentToMarker(content){

    //let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    return infoWindow;

  }

  getUserPosition(){

    let options: GeolocationOptions = {
      enableHighAccuracy: true,
    };
    return new Promise((resolve, reject) =>{
        this.geolocation.getCurrentPosition(options).then((pos : Geoposition) => {
          
                  this.currentPos = pos;     
          
                  console.log(pos);
                  resolve({latitude: pos.coords.latitude,longitude: pos.coords.longitude});
          
              },(err : PositionError)=>{
                  console.log("error : " + err.message);
                  reject(err);
              ;
          })
    })
    
}
  getContinousPosition(){
    let options: GeolocationOptions = {
      maximumAge: 10000,
      enableHighAccuracy: true
    };
    var observablePosition = new Observable(observerPosition => {
      this.geolocation.watchPosition(options).subscribe(dataPosition =>{
        observerPosition.next(dataPosition);
      })
    })
    return observablePosition;
  }
  getAddress(lat, lng){
    return new Promise((resolve, reject) =>{
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey).map(res=>res.json()).subscribe((data: any)=>{
    
      resolve(data)
      
    
    },(error)=>{

      reject('We could not get the adress');

    });
  })

}
getStaticImageFrom(lat,lng){
  return 'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&markers=size:big%7Ccolor:blue%7Clabel:L%7C'+lat+','+lng+'&zoom=18&size=600x300&key='+this.apiKey;
}
}
