import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../../services/navigation.service'
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from 'flutterwave-angular-v3';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

  publicKey = "FLWPUBK_TEST-5ac81c972b9cbd4ee32e9f30487a00c5-X";
 
  customerDetails = { name: 'Demo Customer  Name', email: 'customer@mail.com', phone_number: '08100000000'}
 
  customizations = {title: 'Mavunifs', description: 'mavunifs', logo: 'https://flutterwave.com/images/logo-colored.svg'}
 
  meta = {'counsumer_id': '7898', 'consumer_mac': 'kjs9s8ss7dd'}
 
 paymentData: InlinePaymentOptions = {
    public_key: this.publicKey,
    tx_ref: this.generateReference(),
    amount: 50,
    currency: 'ZAR',
    payment_options: 'card',
    redirect_url: '',
    meta: this.meta,
    customer: this.customerDetails,
    customizations: this.customizations,
    callback: this.makePaymentCallback,
    onclose: this.closedPaymentModal,
    callbackContext: this
  }

  constructor(
    private router: Router, 
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    public toast: ToastController,
    public modal: ModalController,
    public smodal: ModalController,
    public emodal: ModalController,
    private flutterwave: Flutterwave,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('this.transactions', this.userData.settings)

    console.log('this.userData.profile', this.userData.profile)
    if(this.userData.cards.length == 0) {
      this.api.getCards().subscribe(resp => {
        console.log('resp', resp)
        if(resp.status) {
          this.cards = resp.data
          this.userData.cards = resp.data
        }
      })
    }
    else {
      console.log('userdata', this.userData.cards)
      this.cards = this.userData.cards
    }

    if(this.userData.settings === null || this.userData.settings === undefined) {
      this.api.getSettings().subscribe(response => {
        this.transactions = response.data.transactions
        this.userData.settings = response.data.transactions
        this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment')
        this.debitTrans = this.recent.filter(trans => trans.type.toLowerCase() === 'debit' && (trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment'))
        this.creditTrans = this.recent.filter(trans => trans.type.toLowerCase() === 'credit' && (trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment'))
        console.log('response', response)
      })    
    }
    else {
      this.transactions = this.userData.settings.transactions
      this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment')
      this.debitTrans = this.recent.filter(trans => trans.type.toLowerCase() === 'debit' && (trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment') )
      this.creditTrans = this.recent.filter(trans => trans.type.toLowerCase() === 'credit' && (trans.sub_type.toLowerCase() === 'card' || trans.sub_type.toLowerCase() === 'investment'))
    }
    

    if(this.userData.profile === undefined || this.userData.profile === null) {
      this.userData.getUser().then(user => {
        this.first_name = user.first_name
        this.last_name = user.last_name
      })
    }
    else {
      this.first_name = this.userData.profile.first_name
      this.last_name = this.userData.profile.last_name
    }


    if(this.recent.length == 0) {
      this.isEmpty = false
    }
    else {
      this.isEmpty = true
    }

  }

  slideOptions = {
    slidesPerView: 1, 
    spaceBetween: 20
  }
    
  async errorPage() {
    const modal = await this.emodal.create({
      component: FailurePage,
      componentProps: {
        message: this.message,
        title: 'Operatio failed',
        action: this.action
      }
    });

    modal.onDidDismiss().then(detail => {

    });
    return await modal.present();
  }

  async successPage() {
    const modal = await this.smodal.create({
      component: SuccessPage,
      componentProps: {
        title: this.title
      }
    });

    modal.onDidDismiss().then(detail => {

    });
    return await modal.present();
  }

  async confirmTransaction() {
    const modal = await this.modal.create({
      component: TransactionConfirmationPage,
      componentProps: {
        type: 'card',
        details: this.card_id
      }
    });

    modal.onDidDismiss().then(detail => {
      console.log('details', detail)
      if(detail.data) {
        this.removeCard()
      }
    });
    return await modal.present();
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })
    loader.present()
  }


  card_id: any
  all = true;
  credit = false
  debit = false;
  showForm = false;
  transactionSuccess = false;
  show = true
  isEmpty = true
  cardEmpty = true
  withdrawal = false
  first_name: string
  message: string
  title: string
  last_name: string
  cards = []
  transactions = []
  debitTrans = []
  creditTrans = []
  recent = []
  action: any

  goBack = () => {
    //this.navBack.navigateToPreviousPage()
    this.router.navigateByUrl("/home/user/profile")
  }

  switchPage = (trans: any) => {
    let page = trans.detail.value
    if(page === 'all') {
      this.all = true
      this.debit = false
      this.credit = false
      this.isEmpty = this.recent.length > 0 ? true : false
    }
    else if(page === 'credit') {
      this.credit = true
      this.debit = false
      this.all = false
      this.isEmpty = this.creditTrans.length > 0 ? true : false
    }
    else if(page === 'debit') {
      this.debit = true
      this.credit = false
      this.all = false
      this.isEmpty = this.debitTrans.length > 0 ? true : false
    }
    else {
      this.all = true
    }
  }

  onClick = () => {
    this.showForm = true
    this.show = true
  }

  hideForm = () => {
    this.showForm = false
    this.transactionSuccess = false
  }

  addCard = () => {
    this.router.navigate(['home/user/wallet/cards/add-card']);
  }

  withdraw = () => {
    this.withdrawal = true
  }

  removeCard() {
    this.presentLoader()
    this.api.removeCard(this.card_id).subscribe(response => {
      if(response.status === true) {
        this.userData.setUser(response.user)
        this.cards = response.user.cards
        this.loader.dismiss()
        this.title = response.message
        this.successPage()
      }
      else {
          this.loader.dismiss()
        if(response.message && response.message !== null || response.message !== undefined) {
          this.message = response.message
          this.action = response.action
          this.title = "Operation failed"
        }
        else {
          this.title = "Could not complete action, please try again"
        }
        this.errorPage()
      }
    })
  }

  setDefaultCard(card_id) {
    this.presentLoader()
    this.api.setCard(card_id).subscribe(response => {
      if(response.status === true) {
        this.userData.setUser(response.user)
        this.cards = response.user.cards
        this.loader.dismiss()
        this.title = response.message
        this.successPage()
      }
      else {
        this.loader.dismiss()
        if(response.message && response.message !== null || response.message !== undefined) {
          this.message = response.message
          this.title = "Operation failed"
        }
        else {
          this.title = "Could not complete action, please try again"
        }
        this.errorPage()
      }
    })
  }

  confirmation(card_id) {
    this.card_id = card_id
    this.confirmTransaction()
  }

  makePayment() {
    this.flutterwave.inlinePay(this.paymentData)
  }

  makePaymentCallback(response: PaymentSuccessResponse): void {
    console.log("Payment callback", response);
  }

  closedPaymentModal(): void {
    console.log('payment is closed');
  }
  
  generateReference(): string {
    let date = new Date();
    return date.getTime().toString();
  }  

}
