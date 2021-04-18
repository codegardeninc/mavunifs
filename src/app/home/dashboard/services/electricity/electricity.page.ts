import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../../services/navigation.service'
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';


@Component({
  selector: 'app-electricity',
  templateUrl: './electricity.page.html',
  styleUrls: ['./electricity.page.scss'],
})
export class ElectricityPage implements OnInit {
  confirmation = false
  showForm = false
  transactionSuccess = false
  transactionError = false
  action:any
  message: string
  title: string
  creditToken: string
  operators = []
  service = []
  details = {
    type: 'prepaid',
    service: 'electricity',
    customerName: '',
    amount: '',
    phoneNumber: '',
    meterNo: '',
    customerAddress: '',
    disco: '',
    serviceId: ''
  }

  constructor(
    private navBack: NavigationService,
    public loader: LoadingController,
    private api: AppService,
    private userData: UserData,
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController,
    private storage: Storage
  ) { 
    // this.loadProviders()
  }

  ngOnInit() {
    console.log('respons Ab',this.operators)

  }

  ionViewWillEnter() {
    this.loadProviders()
  }

  loadProviders(){
    console.log('respons A')
    console.log('respons', this.userData.operators)

    console.log('respons o', this.operators)
    if(this.operators.length === 0 || this.operators === null){
      console.log('respons A');
      console.log('respons', this.userData.operators)

      if(this.userData.operators.length === 0 || this.userData.operators === null) {
        this.api.getProductList('electricity').subscribe( response => {
          console.log('respons', this.userData.operators)

          console.log('respons', response)
          if(response.response === 'OK') {
            this.operators = response.result
          }
        })     

      }
      else {
        this.operators = this.userData.operators
      }
      this.api.getOperators('electricity').subscribe(response => {
        if(response.status) {
          this.details.serviceId = response.data.id
        }
      })
    }
  }

  
  async errorPage() {
    const modal = await this.emodal.create({
      component: FailurePage,
      componentProps: {
        message: this.message,
        title: this.title,
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
        title: this.title,
        creditToken: this.creditToken
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
        type: 'electricity',
        details: this.details
      }
    });

    modal.onDidDismiss().then(detail => {
      console.log('details', detail)
      if(detail.data) {
        this.submit()
      }
    });
    return await modal.present();
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }
  
  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles',
    })

    loader.present();
  }


  onClick = (form) => {
    if(form.valid) {
      this.presentLoader()

      this.api.verify(this.details).subscribe(response => {
        console.log('response', response)
        if(response.status) {
          this.loader.dismiss()
          this.details.customerName = response.data.message
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
              this.message = "Could not complete action, please try again"
          }
          this.errorPage()
        }
      })
    }
  }

  hideForm = () => {
    this.confirmation = false
    this.showForm = false
  }

  submit = () => {
    this.presentLoader()
    this.api.buyElectricity(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status) {
        this.loader.dismiss()
        this.creditToken = response.token
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.storage.set("user", response.user)
        //this.userData.setUser(response.user)
        this.userData.accountBalance = response.user.wallet_balance
        this.title = "Meter topup successful" 
        this.successPage()
      }
      else {
        // this.loader.dismiss()
        // this.action = response.action //&& response.action === true ? true : false
        // this.message = response.message && response.message !== null ? response.message : "Transaction is processing" 
        // this.title = "Operation failed"
        // this.errorPage()
        this.loader.dismiss()
        if(response.message && response.message !== null) {
          this.message = response.message
          this.title = "Operation failed"
          this.action = response.action
        }
        else {
            //this.message = "Your transaction is processing"
            this.title = "Transaction is processing"
        }
        this.errorPage()
      }
    })
  }
}
