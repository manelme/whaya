import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MongoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MongoServiceProvider {

  private headers = new Headers();
  private userAuth: any;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello MongoServiceProvider Provider');
  }
  savePosition(email,latitude,longitude){
    let request = new URLSearchParams();
    request.set('email', email);
    request.set('latitude', latitude);
    request.set('longitude', longitude);

    
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data : any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/mongoservice/locations', request.toString(), { headers: this.headers }).subscribe((data) => {

            console.log(data);
            resolve(data);


          }, (err) => {

            reject(err);

          });
        })
      })
          
          })
  }

}
