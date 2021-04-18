import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
}) 
export class DashboardPage implements OnInit {
  notificatio = []
  notification_count: any
  details: any = {}
  accountNumber: any
  balance = 0.00
  savings_balance = 0.00
  networth = 0.00;
  showLoading = false;

  image = '../../../assets/imgs/avatar.jpg';

  slideOpt = {
    slidesPerView: 1.1,
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: AppService,
    private userData: UserData,
    private storage: Storage

  ) { 
    // this.loadUserDetails();
    console.log('contsructor');
  }

  
ngOnInit() { 
   this.loadUserDetails();
  console.log('init')
}

 ionViewWillEnter() {  
 this.loadUserDetails();
 this.loadUserSettings();  
  console.log('willendter')
}

ionViewDidEnter() {
   this.refreshBalances()
    console.log('didload')
} 

refreshBalances(){
    this.showLoading = true;
    console.log('detialsss', this.details)

      this.api.getUserProfile(this.details.id).subscribe(apiResponse => {
        console.log('new user', apiResponse);
        if(apiResponse.status) {
          this.storage.set('user', apiResponse.data).then(user => {
          this.loadUserDetails();
          this.loadUserSettings();  
          this.showLoading = false;
        })
      } else {
        this.showLoading = false;

      }
    })
  }
  
  loadUserDetails(){
      this.storage.get('user').then(user => {
        console.log('user', user)
        this.userData.userDetails = user
        this.userData.profile = user
        this.details = user
        this.networth = Number(user.networth);
        this.balance = Number(user.wallet_balance);
        this.savings_balance = Number(user.savings_balance);
        this.userData.accountBalance = Number(user.wallet_balance)
        this.accountNumber = user.account[0].account_number
        this.image = user.kyc.profile_photo
        this.userData.transactions = user.transactions
        console.log('this.balance', this.image)
      });
  }


  loadUserSettings(){
    this.api.getSettings().subscribe(response => {
      console.log('settings', response)
      if(response.status) {
        this.userData.settings = response.data
        this.userData.notifications = response.data.notifications
        this.notificatio = response.data.notifications
        this.notification_count = this.notificatio.length
      }
    })

    this.api.getProductList('electricity').subscribe( response => {
      if(response.response === 'OK') {
        this.userData.operators = response.result
      }
    }) 
    console.log('this.userData.settings', this.userData.settings)
  }

  onClick = (page: any) => {
    if(page === 'loan') {
      this.router.navigate(['home/user/dashboard/loans'])
    }
    else if(page === 'investment') {
      // this.router.navigate(['home/user/dashboard/investments'])
      alert("This feature is not available at the moment")
    }
    else if(page === 'bills') {
      this.router.navigate(['home/user/dashboard/services'])
    }
  }

  notifications = () => {
    this.router.navigate(['/home/dashboard/notifications'])
  }

  savings() {
    // this.router.navigateByUrl('home/user/savings')
    alert("This feature is not available at the moment");
  }

  wallet() {
    this.router.navigateByUrl('home/user/wallet')
  }

  investment() {
    // this.router.navigateByUrl('home/user/dashboard/investments')
    alert("This feature is not available at the moment")
  }

  profile() {
    this.router.navigateByUrl('home/user/profile')
  }
}
