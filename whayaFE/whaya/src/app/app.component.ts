import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage} from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage) {
    
    
    this.storage.get("currentUser").then(currentUser=>{
      if (currentUser === null) {
        console.log("not logged in");
          this.rootPage = LoginPage;
      } else {
        console.log("already logged in");
          this.rootPage = TabsPage;
      }
  });
    

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
