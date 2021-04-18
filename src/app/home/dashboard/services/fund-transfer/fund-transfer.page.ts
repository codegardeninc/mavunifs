import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service'
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.page.html',
  styleUrls: ['./fund-transfer.page.scss'],
})
export class FundTransferPage implements OnInit {

  constructor(
    private navBack: NavigationService, 
    private router: Router,
    private storage: Storage,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController
  ) { }

  ngOnInit() {
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })

    loader.present();
  }

  ionViewWillEnter() {
    //this.confirmTransaction()
    if(this.userData.userDetails === undefined)  {
     this.storage.get('user').then(user => {
       this.userData.userDetails = user
       this.balance = Number(user.wallet_balance);       
     });
    }
    else {
     this.balance = Number(this.userData.accountBalance)
    }

    if(this.userData.banks === undefined || this.userData.banks.length == 0) {
      this.api.getBanks().subscribe(response => {
        console.log('response', response)
        if(response.status) {
          this.banks = response.data
        }
      })
    }
    else {
      this.banks = this.userData.banks
    }
   }

   balance = 0.00
   transactionError = false
   transactionSuccess = false
   showForm = false
   confirmation = false
   message: string
   title: string
   action: any
   banks = []
   detail: any

   details = {
     amount: 5000,
     type: '',
     password: '',
     uid: '',
     accountNumber: '',
     bankCode: '',
     note: '',
     accountName: '',
     bank: '',
     charge: false
   }

   withdrawalMsg = false

   info = {
     discount: '',
     description: ''
   }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  async confirmTransaction() {
    const modal = await this.modal.create({
      component: TransactionConfirmationPage,
      componentProps: {
        type: 'withdrawal',
        details: this.details,
        detail: this.detail

      }
    });

    modal.onDidDismiss().then(detail => {
      console.log('detail', detail)
      if(detail.data) {
        this.save()
      }
      else {
        this.details.charge = false
      }
    });
    return await modal.present();
  }

  async errorPage() {
    const modal = await this.emodal.create({
      component: FailurePage,
      componentProps: {
        message: this.message,
        title: this.title,
        withdrawalMsg: this.withdrawalMsg,
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

  onClick = (form) => {    
    if(form.valid) {
      this.presentLoader()
      this.api.confirmPassword(this.details).subscribe(response => {
        console.log('response', response)
        if(response.status === true) {
          this.api.verifyAccount(this.details).subscribe(resp => {
            this.details.uid = response.data.id
            console.log('object ====>', resp)
            if(resp.status === true) {
              this.loader.dismiss()
              this.details.accountName = resp.data.accountName
              this.confirmTransaction()
            }
            else { 
              this.loader.dismiss()
              if(response.message && response.message !== null) {
                this.message = response.message
                this.title = "Operation failed"
                this.action = response.action
              }
              else {
                  this.title = "Operation failed"
                  this.message = "Could not complete action please try again"
              }
              this.errorPage()
            }
          })
        }
        else {
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Operation failed"
            this.action = response.action
          }
          else {
              this.message = "Could not complete action, please try again"
              this.title = "Operation failed"
          }
          this.errorPage()
        }
      })
    }

    //this.router.navigate(['home/user/transactions'])
  }

  save() {
    this.presentLoader()
    this.api.fundTransfer(this.details).subscribe(response => {
      console.log('response ==>', response) 
      if(response.status === true) {
        this.loader.dismiss()
        this.storage.set("user", response.user)
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.balance = response.user.wallet_balance
        this.userData.accountBalance = response.user.wallet_balance
        this.userData.transactions = response.user.transactions
        this.details.accountName = ''
        this.details.amount = 5000
        this.details.bankCode = ''
        this.details.note = ''
        this.details.password = ''
        this.title = 'Withdrawal successful'
        this.successPage()
      }
      else if(response.type === 'charge') {
        this.loader.dismiss()
        this.message = response.message
        this.detail = response
        this.details.charge = true
        this.confirmTransaction()
      }
      else {
        // this.loader.dismiss()
        // this.action = response.action && response.action === true ? true : false
        // this.details.charge = false
        // this.message = response.message
        // this.title = 'Operation failed' 
        // this.errorPage()
        this.loader.dismiss()
        if(response.message && response.message !== null) {
          this.message = response.message
          this.title = "Operation failed"
          this.action = response.action
          this.details.charge = false
        }
        else {
            //this.message = "Your transaction is processing"
            this.title = "Transaction is processing"
        }
        this.errorPage()
      }
    })
  }

  hideForm() {
    this.showForm = false
  }

  selectBank() {
    let bank = this.banks.filter(bank => bank.code === this.details.bankCode)
    this.details.bank = bank[0].name
  }

}
