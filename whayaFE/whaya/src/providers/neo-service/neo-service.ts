import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the NeoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NeoServiceProvider {

  private headers = new Headers();
  private userAuth: any;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello NeoServiceProvider Provider');
  }

  addUser(email: string, name: string, avatar: string) {

    let request = new URLSearchParams();
    request.set('email', email);
    request.set('name', name);
    request.set('avatar', avatar);
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/neoservice/users', request.toString(), { headers: this.headers }).subscribe((data) => {

            resolve(data);


          }, (err) => {
            reject(err);
          });
        })
      })

    })
  }
  updateUser(id, name:string, avatar:string){
    let request = new URLSearchParams();
    request.set('name', name);
    request.set('avatar', avatar);
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/neoservice/users/'+id+'/', request.toString(), { headers: this.headers }).subscribe((data) => {

            resolve(data);


          }, (err) => {
            reject(err);
          });
        })
      })

    })
  }
  getUserByEmail(email: string) {

    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.get('http://manelme.com:8080/neoservice/users/email/' + email + '/', { headers: this.headers }).subscribe((data) => {

            resolve(data);


          }, (err) => {

            console.log('Ooops!!', err);
            reject(err);
          });

        })
      })



    })

  }
  getFriends(id: number) {

    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);
          this.http.get('http://manelme.com:8080/neoservice/users/friends/' + id, { headers: this.headers }).subscribe((data) => {

            resolve(data);


          }, (err) => {

            console.log('Ooops!!', err);
            reject(err);
          });

        })
      })



    })
  }
  createFriendship(userId: string, email: string) {

    let request = new URLSearchParams();
    request.set('email', email);
    request.set('userId', userId);
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/neoservice/users/requestfriend', request.toString(), { headers: this.headers }).subscribe((data) => {

            this.storage.get('requestedFriends').then((friendships) =>{

              if(friendships){
                friendships.push(email)
                this.storage.set('requestedFriends', friendships);
              }else{
                let aux = new Array<{}>();
                aux.push(email); 
                this.storage.set('requestedFriends', aux);
              }

            })
            resolve(data);
            


          }, (err) => {
            reject(err);
          });
        })
      })

    })
  }
  acceptFriendship(userId: string, email: string) {

    let request = new URLSearchParams();
    request.set('email', email);
    request.set('userId', userId);
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/neoservice/users/acceptfriend', request.toString(), { headers: this.headers }).subscribe((data) => {

            resolve(data);


          }, (err) => {
            reject(err);
          });
        })
      })

    })
  }
  createPlace(userId: string, name: string, latitude, longitude, date: string ) {
    
        let request = new URLSearchParams();
        request.set('name', name);
        request.set('longitude', longitude);
        request.set('latitude', latitude);
        request.set('date', date);
        request.set('userId', userId);
        return new Promise((resolve, reject) => {
    
          this.storage.ready().then(() => {
            this.storage.get("currentUserAuth").then((data: any) => {
              this.userAuth = data;
              this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
              this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);
    
              this.http.post('http://manelme.com:8080/neoservice/users/createPlace', request.toString(), { headers: this.headers }).subscribe((data) => {  
  
                resolve(data);

              }, (err) => {

                reject(err);
                
              });
            })
          })
    
        })
      }
  getClosePlacesFriends(userId,longitude,latitude,distance){
    
    let request = new URLSearchParams();
    request.set('longitude', longitude);
    request.set('latitude', latitude);
    request.set('distance', distance);
    
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);
          this.http.get('http://manelme.com:8080/neoservice/places/close/' + userId,  { headers: this.headers, params: request.toString() }).subscribe((data) => {

            resolve(data);


          }, (err) => {

            console.log('Ooops!!', err);
            reject(err);
          });

        })
      })
    })
  }
  postScore(score, comment:string, userId: string, placeId ) {
    
    let request = new URLSearchParams();
    request.set('score', score);
    request.set('comment', comment);
    request.set('userId', userId);
    request.set('placeId', placeId);
    return new Promise((resolve, reject) => {

      this.storage.ready().then(() => {
        this.storage.get("currentUserAuth").then((data: any) => {
          this.userAuth = data;
          this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
          this.headers.append('Authorization', 'Bearer ' + this.userAuth.access_token);

          this.http.post('http://manelme.com:8080/neoservice/users/score', request.toString(), { headers: this.headers }).subscribe((data) => {  

            resolve(data);

          }, (err) => {

            reject(err);
            
          });
        })
      })

    })
  }
}
