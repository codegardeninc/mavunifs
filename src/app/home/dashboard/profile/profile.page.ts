import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private router: Router,
    private api: AppService,
    private userData: UserData,
    private storage: Storage,
    private nav: NavigationService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('this.userData.profile', this.userData.profile)
    if(this.userData.profile === undefined) {
      this.userData.getUser().then(response => {
        console.log('response', response)
        this.profile = response
        this.userData.profile = response
        this.email =  response.email
        this.account_number = response.account[0].account_number
        this.first_name =  response.first_name
        this.last_name = response.last_name
        this.phone_number = response.phone_number
        this.profile_photo = response.kyc.profile_photo
      })
    }
    else {
      this.profile = this.userData.profile
      this.profile_photo = this.profile.kyc.profile_photo
      this.email =  this.profile.email
      this.account_number = this.profile.account[0].account_number
      this.first_name =  this.profile.first_name
      this.last_name = this.profile.last_name
      this.phone_number = this.profile.phone_number
      this.profile_photo = this.profile.kyc.profile_photo
    }

  }

  save = false
  details = false
  first_name: string
  last_name: string
  phone_number: string
  profile: any
  profile_photo = '../../../assets/imgs/avatar.jpg';

  account_number: any
  email: string


  onClick = () => {
    this.save = true
  }

  gotoPage = (page: any) => {
    if(page === 'card') {
      this.router.navigate(['home/user/wallet/cards'])
    }
    else {
      this.router.navigate(['home/user/profile/'+page])
    }
  }

  support = () => {
    this.router.navigate(['home/user/dashboard/support'])
  }

  signOut = () => {
    this.userData.logout()
    this.storage.set('hasLoggedIn', false)
    this.router.navigate(['home/auth/login'])
  }

  cancel() {
    this.nav.navigateToPreviousPage()
  }

}
