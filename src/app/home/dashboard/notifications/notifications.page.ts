import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  deleting: boolean;

  constructor(
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() { 
  }

  clear_item = false
  segment = false
  notifications = []
  payment = []
  is_payment = false

  segmentChanged = (data:any) => {
    console.log('data', data)
    this.is_payment = data.detail.value === "payment" ? true : false
  }


  goBack = () => {
    this.router.navigateByUrl("/home/user/dashboard")
    //this.navBack.navigateToPreviousPage()
  }

  ionViewWillEnter() {
    if(this.userData.settings === undefined || this.userData.settings === null) {
      this.api.getSettings().subscribe(response => {
        console.log('notifications', response)
        if(response.status) {
          this.userData.settings = response.data
          this.notifications = response.data.notifications
          this.payment = this.notifications.filter(notification => notification.type.toLowerCase() === "payment" || notification.type.toLowerCase() === "savings")
        }
      })
    }
    else {
      this.notifications = this.userData.settings.notifications
      this.payment = this.notifications.filter(notification => notification.type.toLowerCase() === "payment" || notification.type.toLowerCase() === "savings")
    }
    
    console.log('this.notifications', this.notifications)
  }


  clearNotification(not_id: any) {
    console.log('not_id', not_id)
    if(not_id && not_id !== undefined) {
      this.notifications.splice(not_id, 1)

      this.api.readNotification(not_id).subscribe(response => {
        if(response.status) {
          this.api.getSettings().subscribe(response => {
            console.log('notifications', response)
            if(response.status) {
              this.storage.set("user", response.user)
              this.deleting = false;
              this.userData.settings = response.data
              this.notifications = response.data.notifications
            }
          })
        }
      })
    }

  }


}
 