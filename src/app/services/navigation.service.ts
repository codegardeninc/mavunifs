import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private navController: NavController) { }

  public navigateToPreviousPage() {
    const url = this.router.url;
    if (url.match("(^\/[a-zA-Z0-9\-\.]*)$")) {
      navigator['app'].exitApp();
    } else {
      this.navController.navigateBack(url.replace(new RegExp("(\/([a-zA-Z0-9\-\.])*)$"), ""));
    }
  }
}
