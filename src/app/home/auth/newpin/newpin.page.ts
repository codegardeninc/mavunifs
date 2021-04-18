import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';

@Component({
  selector: 'app-newpin',
  templateUrl: './newpin.page.html',
  styleUrls: ['./newpin.page.scss'],
})
export class NewpinPage implements OnInit {

  details: any = {
    email: '',
    otp: '',
    pin: '',
    confirm_pin: ''
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: AppService,
    private loader: LoadingController,
    private toast: ToastController,
    private storage: Storage
  ) { 
    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.details.email = this.router.getCurrentNavigation().extras.state.email
        let email = this.router.getCurrentNavigation().extras.state.email
        console.log('this', email)
      }
    })
  }

  ngOnInit() {
  }

  onClick = () => {
    this.router.navigate(['home/auth/login'])
  }

  goBack(){
    this.router.navigate(['home/auth/login']) 
  }

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      cssClass: "toast",
      duration: 4000,  
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


  resetPin(form) {
    console.log('this.details', this.details)
    if(form.valid) {
      this.presentLoader()
      this.api.resetPassword(this.details).subscribe(response => {
        console.log('response', response)
        if(response.status) {
          this.loader.dismiss()
          this.presentToast(response.message)
          this.router.navigateByUrl("home/auth/login")
        }
        else {
          this.loader.dismiss()
          this.presentToast(response.message)
        }
      })
    }
  }
}
