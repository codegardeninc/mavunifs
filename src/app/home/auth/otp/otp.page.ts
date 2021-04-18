import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  constructor(
    private router: Router, 
    public loader: LoadingController,
    private api: AppService, 
    private route: ActivatedRoute,
    public toast: ToastController
  ) { 
    this.route.queryParams.subscribe( params => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.details.phonenumber = this.router.getCurrentNavigation().extras.state.phonenumber
        this.otp = this.router.getCurrentNavigation().extras.state.otp
        console.log('this.details', this.details)
        this.getOtp()
      } else{
        this.router.navigate(['/home/auth/signup'])
      }
    })
  }

  @ViewChild('ot1', {static: false}) ot1: IonInput;
  @ViewChild('ot2', {static: false}) ot2: IonInput;
  @ViewChild('ot3', {static: false}) ot3: IonInput;
  @ViewChild('ot4', {static: false}) ot4: IonInput;
  @ViewChild('ot5', {static: false}) ot5: IonInput;
  @ViewChild('ot6', {static: false}) ot6: IonInput;

 
  ngOnInit() {
  }

  otp: any
  otp1 = ''
  otp2 = '' 
  otp3 = ''
  otp4 = ''
  otp5 = ''
  otp6 = ''
  msg = ''
  error = false

  details = {
    phonenumber: '',
    otp: ''
  }

  ionViewWillEnter() {
    setTimeout(() => this.ot1.setFocus(), 0);
  }

  setAutoFocus(ot1, ot2: IonInput) {  
    if(ot1.value.length) {
      ot2.setFocus()
    }
  }
  
  verify(form) {

    this.details.otp = form.value.otp1+''+form.value.otp2+''+form.value.otp3+''+form.value.otp4+''+form.value.otp5+''+form.value.otp6

    if(form.valid) {
      if(this.details.otp.length ===6){
        this.showLoader()
        this.api.verifyOtp(this.details).subscribe(res => {
          if(res.status && res.isUser) {
            this.loader.dismiss()
            let navigationExtras: NavigationExtras = {
              state: {
                user: res.user
              }
            }
            this.router.navigate(['/home/auth/login'], navigationExtras)            
          }
          else if(res.status) {
            this.loader.dismiss()
            let navEx: NavigationExtras = {
              state: {
                phonenumber: this.details.phonenumber
              }
            }
            this.router.navigateByUrl('home/auth/create-pin', navEx);
          } 
          else {
            this.loader.dismiss()
            this.showToast(res.message)
            this.error = res.message
          }
        })
      }
    }
  }
  
  async showLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })
    await loader.present();
  }
  
  
  async showToast(msg) {
    let toast = await this.toast.create({
      position: 'middle',
      message: msg,
      duration: 1000
    })
    await toast.present();
  }
  
  getOtp() {
    this.otp == undefined;
    this.otp1 = '';
    this.otp2 = '' ;
    this.otp3 = ''
    this.otp4 = ''
    this.otp5 = ''
    this.otp6 = ''
    this.showLoader()
    this.api.resendOtp(this.details).subscribe(res => {
      console.log('res', res)
      if(res.status) {
        this.otp = res.otp
        this.error = false
        this.loader.dismiss()
      } else {
        this.error = true
        this.msg = res.message
        this.loader.dismiss()
      }
    })
  }  

  goBack(){
    this.router.navigateByUrl('home/auth/signup');
  }



}
