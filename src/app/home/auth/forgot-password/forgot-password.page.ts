import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
 details: any = {
   email: '',
   phoneNumber: ''
 };
  constructor(
    private router: Router,
    private api: AppService,
    private loader: LoadingController,
    private toast: ToastController
  ) { }

  ngOnInit() {
  } 

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      cssClass: "toast",
      duration: 5000,  
      buttons: ["OK"]     
    })

    toast.present()
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: "bubbles"
    })

    loader.present()
  }

  onClick = () => {
    this.router.navigate(['/home/auth/newpin']);
  }

  goBack(){
    this.router.navigateByUrl('/home/auth/login');
  }

  sendMail(form) {
    //this.router.navigateByUrl("home/auth/newpin")
    if(form.valid) {
      this.presentLoader()
      this.api.forgotPassword(this.details).subscribe(response => {
        console.log('response', response)
        if(response["status"] === true) {
          this.loader.dismiss()
          this.presentToast("Check your email for a password reset code")
          let navEx: NavigationExtras = {
            state: {
              email: this.details.email
            }
          }
          this.router.navigateByUrl("home/auth/newpin", navEx)
        }
        else {
          this.loader.dismiss()
          this.presentToast(response["message"])
        }
      })
    }
  }

}
