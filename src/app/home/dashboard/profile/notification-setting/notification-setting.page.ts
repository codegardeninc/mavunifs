import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.page.html',
  styleUrls: ['./notification-setting.page.scss'],
})
export class NotificationSettingPage implements OnInit {

  constructor(
    private navBack: NavigationService,
    private userData: UserData,
    private api: AppService,
    public toast: ToastController,
    public loader: LoadingController
    ) { }

  ngOnInit() {
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  settings: any
  email_notification = false
  push_notification = false
  user_id: any

  details = {
    user_id: '',
    email_notification: false,
    push_notification: false
  }

  ionViewWillEnter() {
    this.user_id = this.userData.profile.id
    this.settings = this.userData.profile.app_settings
    this.details.user_id = this.userData.profile.id
    this.details.email_notification = this.userData.profile.app_settings.email_notification
    this.details.push_notification = this.userData.profile.app_settings.push_notification
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 6000,
      cssClass: 'toast',
      position: 'middle'
    });
    await toast.present();
  }  

  async presentLoader() {
    const loader = await this.loader.create({
      spinner: 'bubbles'
    });
    await loader.present();
  }  

  saveSetting(form) {
    if(form.valid) {
      this.presentLoader()
      this.api.appSettings(this.details).subscribe(response => {
        this.loader.dismiss()
        if(response.status === true) {
          this.push_notification = response.data.email_notification
          this.push_notification = response.data.push_notification
          this.presentToast('Settings saved')
        }
      })
    }
  }

}
