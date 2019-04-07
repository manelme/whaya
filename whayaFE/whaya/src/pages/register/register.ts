import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {


  email: string;
  password: string;
  name: string;
  error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage, public alertCtrl: AlertController, public authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerUser() {

    let confirm = this.alertCtrl.create({
      title: 'Sign up',
      message: 'Are you sure that do you want to sign up?',
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
            this.authService.registerUser(this.email, this.password).then((data) => {
              this.navCtrl.pop();
            }, (err) => {
        
              this.error = 'Error!!:&nbsp;'+err.text();
        
            });
          }
        }
      ]
    });
    confirm.present();

  }
  cancelRegister(){

    this.navCtrl.pop();

  }

}
