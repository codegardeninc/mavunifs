import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserData } from '../providers/api/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private router: Router,
    private userData: UserData,
    private storage: Storage
  
  ) { }

  ngOnInit(){      
  }

  ionViewWillEnter() {
    this.storage.set('SEEN_WALK_THROUGH', true)
    // let g = this.storage.get('hasLoggedIn').then(val => {
    //   if(val === true) {
    //     this.router.navigateByUrl('/home/auth/login', { replaceUrl: true})
    //   }
    //   console.log('g', val)      
    // })
  }

  gotoPage = (page: any) => {
    if(page === 'login') {
      this.router.navigate(['home/auth/login'])
    }
    else if(page === 'signup') {
      this.router.navigate(['home/auth/signup'])
    }
  }
}
