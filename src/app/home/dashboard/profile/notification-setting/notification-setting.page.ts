import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.page.html',
  styleUrls: ['./notification-setting.page.scss'],
})
export class NotificationSettingPage implements OnInit {

  constructor(private navBack: NavigationService) { }

  ngOnInit() {
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

}
