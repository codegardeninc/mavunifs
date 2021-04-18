import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';

@Component({
  selector: 'app-sme-data',
  templateUrl: './sme-data.page.html',
  styleUrls: ['./sme-data.page.scss'],
})
export class SmeDataPage implements OnInit {

  constructor(
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    private router: Router,
    private route: ActivatedRoute,
    public loader: LoadingController,
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
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
        type: 'data',
        details: this.details
      }
    });

    modal.onDidDismiss().then(detail => {
      if(detail.data) {
        this.submit()
      }
    });
    return await modal.present();
  }


  ionViewWillEnter() {
    if(this.userData.categories === undefined) {
      this.api.getOperators('sme_data').subscribe( response => {
        console.log('sme data', response)
        this.bundles = response.data.services
        this.details.serviceId = response.data.id
      })
    }
    else {
      this.service = this.userData.categories.filter( category => category.type === 'sme_data')
      this.details.serviceId = this.service[0].id
      this.bundles = this.service[0].services
    }
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles',
    })

    loader.present();
  }

  
  confirmation = false
  showForm = false
  transactionSuccess = false
  transactionError = false
  service_type: string
  message: string
  action: any
  title: string
  categories = []
  service = []
  operators = []
  bundles = []
  details = {
    network: '',
    phoneNumber: '',
    amount: '',
    serviceId: '',
    bundle: ''
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  onClick = (form) => {
    if(form.valid) {
      this.confirmTransaction()
    }
  }

  hideForm = () => {
    this.confirmation = false
    this.showForm = false
  }

  submit = () => {
    this.presentLoader()
    this.api.buyCheapData(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status === true) {
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.storage.set("user", response.user)
        this.userData.accountBalance = response.user.wallet_balance
        this.title = "Purchase successful"
        this.loader.dismiss()
        this.successPage()
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

  selectProvider = () => {
  }

  selectBundle = () => {
    console.log('dsdghj', this.bundles)
   let bandle = this.bundles.filter(bundle => bundle.name === this.details.bundle)
   this.details.amount = bandle[0].amount
  }


}
