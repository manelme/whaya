import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetingModalPage } from './meeting-modal';

@NgModule({
  declarations: [
    MeetingModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetingModalPage),
  ],
})
export class MeetingModalPageModule {}
