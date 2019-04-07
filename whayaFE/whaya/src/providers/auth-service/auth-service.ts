import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  private headers = new Headers();
  private request = new URLSearchParams();

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

  registerUser(email: string, password: string){
    
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.request.set('username', email);
    this.request.set('password', password);

    return new Promise((resolve, reject) =>{

      this.http.post('http://manelme.com:8080/authservice/user',this.request.toString(), {headers: this.headers}).subscribe((data) => {
        
              resolve(data);
        
            }, (err)=>{
        
              console.log('Ooops!!', err);
              
              
              reject(err);
        
            });

    })

    
  }
  loginUser(email: string, password: string){

    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Authorization', 'Basic Y2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=')
    this.request.set('username', email);
    this.request.set('password', password);
    this.request.set('grant_type', 'password');
    this.request.set('client_id', 'clientIdPassword');

    
    return new Promise((resolve, reject) =>{
      
      this.http.post('http://manelme.com:8080/authservice/oauth/token',this.request.toString(), {headers: this.headers}).subscribe((data) => {

              resolve(data);
              
              
            }, (err)=>{
        
              console.log('Ooops!!', err);
              reject(err);
            });
    })


    
  }
  refreshToken(refreshToken){

    console.log(refreshToken);
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Authorization', 'Basic Y2xpZW50SWRQYXNzd29yZDpzZWNyZXQ=')
    this.request.set('grant_type', 'refresh_token');
    this.request.set('refresh_token', refreshToken);
    this.request.set('client_id', 'clientIdPassword');
    

    
    return new Promise((resolve, reject) =>{
      
      this.http.post('http://manelme.com:8080/authservice/oauth/token',this.request.toString(), {headers: this.headers}).subscribe((data) => {
              resolve(data);
              
              
            }, (err)=>{
              reject(err);
            });
    })


  }

}
