import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  action = false
  details = 0
  debit = false
  credit = false
  isEmpty = true
  debitCredit = true
  transactions = []
  debitTransactions = []
  invTrans = []
  creditTransactions = []
  url = "https://mavunifs.com"

  constructor(
    private userData: UserData,
    private api: AppService,
    private storage: Storage,
    private clipboard: Clipboard,
    private social: SocialSharing,
    public toast: ToastController
  ) {
    this.switchPages('all');
   }

  ngOnInit() {
    
  }


  ionViewWillEnter() {
    console.log('this.userData.profile', this.userData.transactions)
    if(this.userData.settings === null || this.userData.settings === undefined) {
      this.api.getSettings().subscribe(response => {
        console.log('object', response) 
        this.userData.settings = response.data
        this.transactions = response.data.transactions
        this.userData.transactions = response.data.transactions
        this.creditTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'credit')
        this.debitTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'debit')
      })    
    }
    else {
      this.transactions = this.userData.settings.transactions
      this.creditTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'credit' )
      this.debitTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'debit')
    }

    if(this.transactions.length == 0) {
      this.isEmpty = false
    }
    else {
      this.isEmpty = true
    }

    console.log('this.transactions', this.userData.settings)
    this.switchPages('all');
  }

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      position: "bottom",
      duration: 2000,
      cssClass: "toast"
    })
    toast.present()
  }

  copy(data) {
   let transaction = this.transactions.filter(transa => transa.id === data)

   let message = `${transaction[0].description}  \n Trnx ID( ${transaction[0].ref} \n 
                    Amount: ${transaction[0].amount} \n Type: ${transaction[0].sub_type} \n
                    Date: ${transaction[0].created_at}` 
    this.clipboard.copy(message)
    this.presentToast("Copied")
  }

  whatsappShare(data) {
    let transaction = this.transactions.filter(transa => transa.id === data)

    let message = `${transaction[0].description}  \n payment ID( ${transaction[0].ref} \n 
                     Amount: ${transaction[0].amount} \n Type: ${transaction[0].sub_type} \n
                     Date: ${transaction[0].created_at}`
    this.social.share(message, "Refer and earn", null, this.url)            
    //this.social.shareViaWhatsApp(message, this.url)
   }

  showDetails = (evn: any) => {
    console.log('evn', evn)
    this.details = this.details == evn ? 0 : evn
  }

  switchPages = (trans: any) => {
   console.log('drr', trans.type)
    
    this.transactions = this.userData.settings.transactions
    // this.creditTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'credit')
    // this.debitTransactions = this.transactions.filter(trans => trans.type.toLowerCase() === 'debit')
    // this.userData.getUser().then(response => {
    // })
    let page = 'all';

    if(trans.detail) {
      page = trans.detail.value
    }
    
    if(page === 'credit') {
      this.credit = true
      this.debit = false
      this.debitCredit = false
      this.isEmpty = this.creditTransactions.length > 0 ? true : false
    }
    else if(page === 'all') {
      this.debitCredit = true
      this.debit = false
      this.credit = false
      this.isEmpty = this.transactions.length > 0 ? true : false
    }
    else if(page === 'debit') {
      this.debit = true
      this.credit = false
      this.debitCredit = false
      this.isEmpty = this.debitTransactions.length > 0 ? true : false
    }
    else {
      this.credit = true
    }
  } 

  doAction = () => {
    this.presentToast("Available soon")
    this.action = true
  }
}
