import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { CardConfirmationPage } from '../card-confirmation/card-confirmation.page';
import { FailurePage } from '../failure/failure.page';
import { SuccessPage } from '../success/success.page';
import { TransactionConfirmationPage } from '../transaction-confirmation/transaction-confirmation.page';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(
    private router: Router,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    public modal: ModalController,
    public smodal: ModalController,
    public emodal: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })
 
    loader.present();
  }

    
  async errorPage() {
    const modal = await this.emodal.create({
      component: FailurePage,
      componentProps: {
        title: this.title,
        message: this.message,
        cardMsg: this.cardMsg,
        msg: this.msg
      }
    });

    modal.onDidDismiss().then(detail => {

    });
    return await modal.present();
  }

  async transfer() {
    const modal = await this.smodal.create({
      component: CardConfirmationPage,
      componentProps: {
        accountNumber: this.accountNumber,
        bankName: this.bankName
      }
    });
    modal.onDidDismiss().then(detail => {
      this.storage.get("user").then(user => {
        this.balance = user.wallet_balance
      })
      this.showForm = false
      this.transactionError = false
      this.confirmation = false
      this.transactionSuccess = false
      this.show = false
    });
    return await modal.present();
  }

  addCard(){
    this.router.navigateByUrl('/home/user/wallet/cards/add-card')
  }

  async successPage() {
    const modal = await this.smodal.create({
      component: SuccessPage,
      componentProps: {
        title: this.title
      }
    });
    modal.onDidDismiss().then(detail => {
      this.storage.get("user").then(user => {
        console.log('oc use', user);
        this.balance = user.wallet_balance
        this.api.getUserProfile(user.id).subscribe(response => {
          if(response.status) {
            console.log('ser use', response);
            this.balance = response.data.wallet_balance      
          }
        })

      })
      this.api.getSettings().subscribe(response => {
        if(response.status) {
          this.transactions = response.data.transactions
          this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() !== 'quick save')
          this.debitTrans = this.recent.filter(trans => trans.type === 'debit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
          this.creditTrans = this.recent.filter(trans => trans.type === 'credit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
        }
      })

      this.showForm = false
      this.transactionError = false
      this.confirmation = false
      this.transactionSuccess = false
      this.show = false
    });
    return await modal.present();
  }

  async confirmTransaction() {
    const modal = await this.smodal.create({
      component: TransactionConfirmationPage,
      componentProps: {
        type: 'saving',
         details: this.details,
      } 
    });

    modal.onDidDismiss().then(detail => {
      if(detail.data) {
        this.creditWallet()
      }
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    this.storage.get("user").then(response => {
      console.log('response', response.account)
      this.cards = response.cards
      this.balance = response.wallet_balance
      this.details.account_id = response.account[0].id
      this.accountNumber = response.account[0].account_number
      this.bankName = response.account[0].bank_name

    })

    if(this.userData.settings === undefined || this.userData.settings === null) {
      this.api.getSettings().subscribe(response => {
        if(response.status) {
          this.transactions = response.data.transactions
          this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() !== 'quick save' )
          this.debitTrans = this.recent.filter(trans => trans.type === 'debit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
          this.creditTrans = this.recent.filter(trans => trans.type === 'credit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
        }
      })
    }
    else {
      this.transactions = this.userData.settings.transactions
      this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() !== 'quick save')
      this.debitTrans = this.recent.filter(trans => trans.type === 'debit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
      this.creditTrans = this.recent.filter(trans => trans.type === 'credit' && (trans.sub_type.toLowerCase() === 'wallet topup' || trans.sub_type.toLowerCase() === 'wallet'))
    }

    this.api.getCards().subscribe(response => {
      if(response.status) {
        this.cards = response.data
      }
    })

    console.log('this.details', this.details)

    console.log('this.cards', this.cards)   

    if(this.recent.length == 0) {
      this.isEmpty = false
    }
    else {
      this.isEmpty = true
    }

  }

  isEmpty = true
  msg:string
  cards = []
  segment = false
  message: string
  transactions = []
  recent = []
  debitTrans = []
  creditTrans = []
  balance = 0.00
  accountNumber: string
  bankName: string = "Sterling Bank"
  all = true;
  action: string
  isCard = false
  credit = false
  isTransfer = false
  debit = false;
  showForm = false;
  show = false
  transactionSuccess = false
  transactionError = false
  confirmation = false
  cardMsg = false
  title: string
  details = {
    amount: '',
    payment_method: '',
    type: '',
    card: '',
    account_id: ''
  }
  

  segmentChanged = (trans: any) => {
    this.balance = this.userData.userDetails.wallet_balance
    this.transactions = this.userData.settings.transactions
    this.recent = this.transactions.filter(trans => trans.sub_type.toLowerCase() !== 'quick save')
    this.debitTrans = this.recent.filter(trans => trans.type === 'debit')
    this.creditTrans = this.recent.filter(trans => trans.type === 'credit')
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

  withdrawal = () => {
    this.router.navigate(['/home/user/dashboard/services/fund-transfer'])
  }

  onClick = () => {
    this.showForm = true
    this.show = true
  }

  hideForm = () => {
    this.showForm = false
    this.transactionError = false
    this.confirmation = false
    this.transactionSuccess = false
    this.show = false
    //this.show = true
  }

  optionChange() {
    if(this.details.payment_method === 'card') {
      this.isCard =  true
    }
    else {
      this.isCard = false
    }
  }


  cardSelected() {
    console.log('this.details', this.details)
  }

  confirm(form) {
    if(form.valid) {
      if(this.details.payment_method === 'transfer') {
        //this.isTransfer = true
        this.isCard =  false
        this.transfer()
        return
      }
      else {
        this.isTransfer = false
        if(this.details.card === null || this.details.card === '' || this.details.card === undefined) {
          this.isCard = true
        }
        else {
          this.confirmTransaction()
        }
      }
    }
  }

  creditWallet = () => {
    this.presentLoader()
    this.api.fundWallet(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status === true) {
        this.loader.dismiss();
        this.title = response.message
        this.storage.set('user', response.user)
        this.userData.profile = response.user
        this.userData.userDetails = response.user
        this.balance = response.user.wallet_balance
        this.title = response.message
        this.successPage()
        //this.show = false
      }
      else {
        this.loader.dismiss()
        if(response.type === "card" || response.message ==="No default card found") {
          this.cardMsg = true // "Go to settings to add a default card" ;
          this.message = response.message
          this.title = "Operation failed"
          this.action = response.action
          this.errorPage()
          //this.router.navigateByUrl('/home/user/wallet/cards/add-card');
        } else{
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.action = response.action
            this.title = "Operation failed"
            this.msg = " Please try again with a different card"
            this.message = response.message
          }
          else {
              //this.message = "Your transaction is processing"
              this.title = "Transaction is processing"
          }
          this.errorPage()
        }
      } 
    })
  }


}
 