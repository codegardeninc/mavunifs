import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppService } from './providers/api/app.service';
import { UserData } from './providers/api/user-data.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: AppService,
    private userData: UserData,
    private storage: Storage,
    private router: Router
  ) {
    this.initializeApp();
  }

  // logoutOrShowSlides(){
  //   this.userData.seenWalkThrough().then(status => {
  //     console.log('status', status)
  //     if(status) {
  //       this.router.navigateByUrl('/home/auth/login')
  //     }
  //     else {
  //       this.router.navigateByUrl('home')
  //     }
  //   })
  // }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
       //this.logoutOrShowSlides()
       this.platform.backButton.subscribeWithPriority(9999, () => {
          document.addEventListener('backbutton', function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('hello');
          }, false);
       })
    });

    this.storage.get('SEEN_WALK_THROUGH' ).then(status => {
      if (status === true) {
        this.router.navigateByUrl('/home/auth/login')
      }
      else {
        this.router.navigateByUrl('home')
      }
    });

    this.platform.pause.subscribe(async () => {
      this.storage.set('lastEvent', Date.now());
    });

    // this.platform.resume.subscribe(async () => {
    //   this.storage.get('lastEvent' ).then(lastevent => {
    //     const timeSincelastevent =  Date.now() - lastevent;
    //     if (timeSincelastevent > 60000) {
    //       this.router.navigateByUrl('/home/auth/login')
    //     }

    //   });
      
    // });

    this.api.getServices().subscribe(response => {
      console.log('Lo serv', response);
      this.userData.categories = response.data
    })

    this.api.getLoans().subscribe(response => {
      this.userData.loans = response.data
    })
  }


}
