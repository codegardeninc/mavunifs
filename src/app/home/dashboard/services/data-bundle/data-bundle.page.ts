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
  selector: 'app-data-bundle',
  templateUrl: './data-bundle.page.html',
  styleUrls: ['./data-bundle.page.scss'],
})
export class DataBundlePage implements OnInit {

  constructor(
    private storage: Storage,
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    private router: Router,
    public loader: LoadingController,
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.userData.categories === undefined) {
      this.api.getOperators('data_bundle').subscribe( response => {
        this.operators = response.data.services
        this.details.serviceId = response.data.id
      })
    }
    else {
      this.service = this.userData.categories.filter( category => category.type === 'data_bundle')
      this.operators = this.service[0].services
      this.details.serviceId = this.service[0].id
      console.log('this.userData.categories', this.service)
    }
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles',
    })

    loader.present();
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
        type: 'data_bundle',
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

  
  confirmation = false
  showForm = false
  transactionSuccess = false
  transactionError = false
  action = false
  service_type: string
  message: string
  title: string
  categories = []
  service = []
  operators = []
  isSmile = false
  bundles = []
  discount = []
  discountAmount = 0.00
  details = {
    service: 'data-bundle',
    type: '',
    amount: '',
    bundle: '',
    phoneNumber: '',
    serviceId: '',
    package: '',
    pin: '',
    account: '',
    customerName: '',
    pinNo: '',
    productCode: ''
  }
  description = {
    info: '',    
    discount: ''
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  onClick = (form) => {
    if(form.valid) {

      this.discount = this.service.filter(service => service.name === this.details.type)
      this.discountAmount = this.discount[0]['discount']
      let medium = this.details.type === 'SPECTRANET' ? this.details.phoneNumber : this.details.account
      this.description.info =
      "You are about to  Top up ₦" +
      Number(this.details.amount).toFixed(2)+" worth of " +
      this.details.type +
      " data bundle to the account number " +
        medium;
      if(this.discountAmount > 0) {
        let cashback = (Number(this.details.amount) * this.discountAmount) / 100;
        this.description.discount =
          "You will get a cash back of ₦" + cashback + " for this transaction";
      }

      this.confirmTransaction()
    }
    
  }

  hideForm = () => {
    this.confirmation = false
    this.showForm = false
  }

  submit = () => {
    this.presentLoader()
    this.api.buyData(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status) {
        this.storage.set("user", response.user)
        this.userData.profile = response.user
        this.userData.userDetails = response.user
        this.title = "Purchase successful"
       this.successPage()
      }
      else {
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

  getProviders() {
    this.presentLoader()
    this.api.getOperators('data_bundle').subscribe( data => {
      if(data.status) {
        this.loader.dismiss()
        this.details.serviceId = data.data.id
        this.operators = data.data.services
        this.service = data.data
      }
      else {
        this.loader.dismiss()
      }
    })
  }

  onChange() {
    this.presentLoader()
    console.log('thhis.details', this.details)
    this.isSmile = false
    this.api.verify(this.details).subscribe( res => {
      if(res.status) {
        this.loader.dismiss()
        console.log('data', res)
        this.bundles = res.data.product
      }
      else {
        this.loader.dismiss()
        console.log(res)
      }
    })
    // if(this.details.type === 'SPECTRANET') {
    // }
    if(this.details.type.toUpperCase() === 'SMILE' || this.details.type.toUpperCase() === 'SMILE BUNDLE') {
      this.isSmile = true
    }
  }  

  getDataPlans(){
    this.presentLoader()
    this.api.verify(this.details).subscribe( res => {
      if(res.status) {
        this.loader.dismiss()
        console.log('data', res)
        this.bundles = res.data.product
        this.details.customerName = res.data.customerName
      }
      else {
        this.loader.dismiss()
        console.log(res.message)
      }
    })
  }

  getPlanDetails() {
    let detail = this.bundles.filter(item => item.allowance == this.details.bundle)
    this.details.amount = detail[0].price
    this.details.productCode = detail[0].code

    //this.details.package = detail[0].allowance
    if(this.details.type === "SMILE") {
      let pkg = detail[0].allowance.split(' ')
      this.details.package = pkg[0]
      this.details.bundle = pkg[0]
    }
    console.log('this.details', detail[0].price)
  }  

}
