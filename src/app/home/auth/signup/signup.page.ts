import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private api: AppService,
    public toastCtrl: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {
  }
  
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'middle',
      cssClass: 'toast'
    })

    await toast.present()
  }

  async shwoAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: this.msg,
      buttons: ['Ok']
    })

    await alert.present()
  }

  async showLoader() {
    let loading = await this.loadingCtrl.create({
      //duration: 7000
      spinner: 'bubbles'
    })

    await loading.present()
  }
  msg: string

  checkUser = (form) => {
    if(form.value.phonenumber === '')  {
      this.showToast('Enter a phone number')
    }

    if(form.valid) {
      this.showLoader()     
      this.api.checkUser(form.value).subscribe(res => {
        console.log('res', res)
        if(res.status && res.isVerified) {
          this.storage.set('user', res.user)
          this.loadingCtrl.dismiss()
          let navigationExtras: NavigationExtras = {
            state: {
              user: res.user
            }
          }
          this.router.navigateByUrl('home/auth/login', navigationExtras)
        }
        else {
          this.api.resendOtp(form.value).subscribe(resp => {
            if(resp.status === true) {
              let navigationExtras: NavigationExtras = {
                state: {
                  phonenumber: form.value.phonenumber,
                  otp: resp.otp
                }
              }
              this.router.navigateByUrl('home/auth/otp', navigationExtras)
              this.loadingCtrl.dismiss()
            } else {
              this.loadingCtrl.dismiss()
              if(res.status && res.status !== null || res.status !== undefined) {
                this.showToast('Network error,please try again')
              }
              else {
                this.showToast("Could not complete action, Try again")
              }
            }
          })
        }
      })
    }
  }

  onClick = () => {
    this.router.navigate(['home/auth/otp'])
  }

  login = () => {
    this.router.navigateByUrl('home/auth/login')
  }
  goBack(){
    this.router.navigate(['/home'])
  }
}
