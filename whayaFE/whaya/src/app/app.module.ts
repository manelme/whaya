import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { MyApp } from './app.component';


import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage, ModalContentPage } from '../pages/login/login';
import { RegisterPage} from '../pages/register/register';
import { MeetingsPage } from '../pages/meetings/meetings'
//import { Chat } from '../pages/chat/chat'

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { NeoServiceProvider } from '../providers/neo-service/neo-service';

import { GeolocProvider } from '../providers/geoloc/geoloc';
import { WsProvider } from '../providers/ws/ws';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MongoServiceProvider } from '../providers/mongo-service/mongo-service';
import { EmojiProvider } from '../providers/emoji';


const config: SocketIoConfig = { url: 'http://manelme.com:9000', options: {} };

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ModalContentPage,
    RegisterPage,
    MeetingsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ModalContentPage,
    RegisterPage,
    MeetingsPage
  ],
  providers: [
    AuthServiceProvider,
    NeoServiceProvider,
    GeolocProvider,
    MongoServiceProvider,
    WsProvider,
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    IonicStorageModule, {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider,
    
  ]
})
export class AppModule {}
