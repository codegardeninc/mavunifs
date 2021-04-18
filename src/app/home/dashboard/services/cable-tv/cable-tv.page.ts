import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';

@Component({
  selector: 'app-cable-tv',
  templateUrl: './cable-tv.page.html',
  styleUrls: ['./cable-tv.page.scss'],
})
export class CableTvPage implements OnInit {
  confirmation = false
  showForm = false
  transactionSuccess = false
  transactionError = false
  action:any
  service_type: string
  message: string
  categories = []
  service = []
  operators = []
  subscriptionPlans = []
  planDetails: any
  title: string
  isStarTimes = false
  discount = []
  discountAmount = 0.00

  description = {
    discount: '',
    info: ''
  }

  details = {
    type: '',
    service: 'cable-tv',
    customerName: '',
    amount: '',
    productCode: '',
    serviceId: '',
    smartCardNo: '',
    packageName: '',
    hasAddon: 0,
    period: '',
    service_charge: 0.00,
    invoice: '',
    customerNumber: '',
    phoneNumber: ''
  }

  constructor(
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    private router: Router,
    public loader: LoadingController,
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.userData.categories === undefined) {
      this.api.getCableOperators().subscribe( response => {
        if(response.status) {
          this.operators = response.data.services
          this.details.serviceId = response.data.id
        }
      })
    }
    else {
      this.service = this.userData.categories.filter( category => category.type === 'cable_tv')
      this.operators = this.service[0].services
      this.details.serviceId = this.service[0].id
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
    });

    modal.onDidDismiss().then(detail => {

    });
    return await modal.present();
  }

  async confirmTransaction() {
    const modal = await this.modal.create({
      component: TransactionConfirmationPage,
      componentProps: {
        type: 'cable',
        details: this.details,
        info: this.description.info,
        discount: this.description.discount
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


  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles',
    })

    loader.present();
  }

  
  

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  onClick = (form) => {
    if(form.valid) {
      this.presentLoader()
      this.api.verify(this.details).subscribe(response => {
        console.log('wee', response);
        let user = response.data
        if(response.status) {
          this.details.customerName = user.customerName
          this.details.customerNumber = user.customerNumber
          this.details.invoice = user.invoice
          this.loader.dismiss()
          this.confirmTransaction()
        }
        else {
          // this.title = "Verification failed"
          // this.message = response.message
          // this.loader.dismiss()
          // this.errorPage()
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Verification failed"
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
  }

  hideForm = () => {
    this.confirmation = false
    this.showForm = false
  }

  submit = () => {
    this.presentLoader()
    this.api.buyCable(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status === true) {
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.storage.set("user", response.user)
        //this.userData.setUser(response.user)
        this.userData.accountBalance = response.user.wallet_balance
        this.title = "Subscription successful"
       this.successPage()
       this.loader.dismiss()

      }
      else {
        // this.loader.dismiss()
        // this.action = response.action //&& response.action === true ? true : false
        // this.message = response.message
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

  selectBundle = () => {
    console.log(this.details.amount)
  }

  getAllSubscriptionPlans() {
    this.presentLoader()
    this.api.tvPlans(this.details).subscribe(res => {
      console.log('res', res)
      if(res.status) {
        let plans = res.data;
        this.loader.dismiss()
        if(this.details.type.toUpperCase() !== 'startimes') {
          this.subscriptionPlans = plans
          this.isStarTimes = false
          console.log('res', this.subscriptionPlans)
        }
        else {
          this.isStarTimes = true
          this.details.packageName = "startimes"
          //this.subscriptionPlans = res.data.products
        }
      }
      else {
        this.loader.dismiss()
      }
    })
  }
  
  verifyCardNumber() {
    this.presentLoader()
    this.api.verify(this.details).subscribe(res => {
      console.log('res', res)
      if(res.status) {
        this.loader.dismiss();
        console.log(res)
        if(this.details.type.toUpperCase() !== 'STARTIMES') {
          this.details.customerName = res.data.customerName
          this.isStarTimes = false
        }
        else {
          this.isStarTimes = true
          this.details.customerName = res.data.customerName
          this.details.packageName = "STARTIMES"
          //this.subscriptionPlans = res.data.products
        }
      }
      else {
        this.loader.dismiss()
      }
    })
  }

  getSelectedPlanDetails() {
    let planDetails = this.subscriptionPlans.filter(item => item.PACKAGE_ID === this.details.productCode)
    this.details.amount = planDetails[0].PACKAGE_AMOUNT
    this.details.period = '1'
    this.details.productCode = planDetails[0].PACKAGE_ID
    this.details.packageName = planDetails[0].PACKAGE_NAME
    console.log('this.planDetails', this.details)
  }
}
