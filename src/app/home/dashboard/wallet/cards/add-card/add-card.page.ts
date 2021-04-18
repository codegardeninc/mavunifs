import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, IonInput, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../../../services/navigation.service'
import { CardVerificationPage } from '../../../card-verification/card-verification.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Inject } from '@angular/core';
// import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from 'flutterwave-angular-v3';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})

export class AddCardPage implements OnInit {

  @ViewChild('expiryMonth', {static: false}) expiryMonth: IonInput
  @ViewChild('expiryYear', {static: false}) expiryYear: IonInput
  @ViewChild('cardcvv', {static: false}) cardcvv: IonInput
  @ViewChild('cardPin', {static: false}) cardPin: IonInput
  @ViewChild('btn', {static: false}) btn: IonInput

//   publicKey = "FLWPUBK_TEST-XXXXXXXXX";
 
//   customerDetails = { name: 'Demo Customer  Name', email: 'customer@mail.com', phone_number: '08100000000'}
 
//   customizations = {title: 'Customization Title', description: 'Customization Description', logo: 'https://flutterwave.com/images/logo-colored.svg'}
 
//   meta = {'counsumer_id': '7898', 'consumer_mac': 'kjs9s8ss7dd'}
 
//  paymentData: InlinePaymentOptions = {
//     public_key: this.publicKey,
//     tx_ref: this.generateReference(),
//     amount: 10,
//     currency: 'ZAR',
//     payment_options: 'card,ussd',
//     redirect_url: '',
//     meta: this.meta,
//     customer: this.customerDetails,
//     customizations: this.customizations,
//     callback: this.makePaymentCallback,
//     onclose: this.closedPaymentModal,
//     callbackContext: this
//   }

  constructor(
   @Inject(InAppBrowser) private iab: InAppBrowser,
    private router: Router, 
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    public toast: ToastController,
    private modal: ModalController,
    private storage: Storage,
    // private flutterwave: Flutterwave,
  ) { }

  ngOnInit() {
  }

  setAutoFocus(val1, val2: IonInput) { 
    //let now = Date.now()
    //console.log('now', now) 
    if(val1.name === 'expiryMonth' && val1.value > val1.max) {      
      this.btn.disabled = true
    }
    else if(val1.name === 'expiryYear' && val1.value < val1.min || val1.value > val1.max) {
      this.btn.disabled = true
    }
    else {
      if(val1.value.length == val1.maxlength) {
        this.btn.disabled = false
        val2.setFocus()
      }
      else {
        this.btn.disabled = true
      }
    }



  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })

    loader.present()
  }

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      position: 'middle',
      duration: 5000,
      cssClass: 'toast',
      buttons: ['OK']
    })

    toast.present()
  }

  details = {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardcvv: '',
    cardPin: '',
    otp: '',
    phone_number: '',
    reference: '',
    action: ''
  }
  type: string
  url: string
  message: string

  async verify() {
    console.log('clicked')
    const modal = await this.modal.create({
      component: CardVerificationPage,
      componentProps: {
        phoneNumber: '',
        otp: '',
        type: this.type,
        url: this.url,
        message: this.message
      }
    });

    modal.onDidDismiss().then(detail => {
      if (detail !== null) {
        if (detail.data.status) {
          if(this.type === 'otp') {
            this.details.otp = detail.data.inputvalue.inputvalue
          }
          else if(this.type === 'phone') {
            this.details.phone_number = detail.data.inputvalue.inputvalue
          }

          this.onClick()
        }
        console.log("The result:", this.details);
      }
    });
    return await modal.present();
  }

  confirm(form) {
    if(form.valid) {
      this.onClick()
    }
  }

  // makePayment(){
  //   this.flutterwave.inlinePay(this.paymentData)
  // }
  // makePaymentCallback(response: PaymentSuccessResponse): void {
  //   console.log("Payment callback", response);
  // }
  // closedPaymentModal(): void {
  //   console.log('payment is closed');
  // }
  
  // generateReference(): string {
  //   let date = new Date();
  //   return date.getTime().toString();
  // }

  verifyWithUrl(url:string) {
    const browser = this.iab.create(url, '_blank', {closebuttoncaption: 'CLOSE', footer: 'yes', closebuttoncolor: '#FFFFFF'});
    browser.on('exit').subscribe(event => {
      console.log('close event', event)
      console.log('url', event.url)
        this.details.action = 'requery'
        this.onClick()
      // if(event.url === 'https://standard.paystack.co/close') {
      // }
      // else {
      //   this.presentToast("Could not charge card")
      // }
    });
  }

  onClick = () => {
    this.presentLoader();
    this.details.cardNumber.replace(/\s/g,'');
    this.api.addCard(this.details).subscribe(response => {
      console.log('card response',  response)
      if(response.status === true) {
        if(response.type === 'otp') {
          this.type = 'otp'
          this.details.action = ''
          this.message = response.message
          this.details.reference = response.reference
          this.details.phone_number = ''
          this.loader.dismiss()
          this.verify()
        }
        else if(response.type === 'phone') {
          this.type = 'phone'
          this.details.action = ''
          this.message = response.message
          this.details.reference = response.reference
          this.details.otp = ''
          this.loader.dismiss()
          this.verify()
        }
        else if(response.type === 'url') {
          this.type = 'url'
          this.details.action = ''
          this.message = response.message
          this.details.reference = response.reference
          this.details.otp = ''
          this.loader.dismiss()
          this.verifyWithUrl(response.url)
        }
        else if(response.type === 'complete') {
          this.loader.dismiss()
          //this.userData.cards.push(response.data)
          this.userData.cards = response.data.cards
          this.storage.set('user', response.data)
          this.userData.accountBalance = response.data.wallet_balance
          this.resetDetails()
          console.log('added card response', response.data)
          this.presentToast('Your card has been added')
          this.modal.dismiss()
          // this.api.getCards().subscribe( result => {
          //   if(result.status) {
          //     this.userData.cards = result.data.cards
          //     this.userData.cards = result.data.cards
          //   } 
          // })
          this.router.navigate(['home/user/wallet/cards']);
        }
      }
      else {
        this.loader.dismiss()
        if(response.message && response.message !== null) {
          this.details.reference = ''
          this.details.otp = ''
          this.details.phone_number = ''
          this.presentToast(response.message)
          this.message = response.message
        }
        else {
          this.presentToast("Transaction is processing")
        }
      }
    })
  }

  
  resetDetails() {
    this.details.phone_number = ''
    this.details.reference = ''
    this.details.otp = ''
    this.details.action = ''
    this.details.cardNumber = ''
    this.details.cardPin = ''
    this.details.cardcvv = ''
    this.details.expiryMonth = ''
    this.details.expiryYear = ''
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

}
