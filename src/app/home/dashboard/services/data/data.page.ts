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
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {

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
      this.api.getOperators('data').subscribe( response => {
        this.operators = response.data.services
        this.details.serviceId = response.data.id
      })
    }
    else {
      this.service = this.userData.categories.filter( category => category.type === 'data')
      this.operators = this.service[0].services
      this.details.serviceId = this.service[0].id
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
  action: any
  service_type: string
  message: string
  title: string
  categories = []
  service = []
  operators = []
  bundles = []
  details = {
    network: '',
    phoneNumber: '',
    amount: '',
    serviceId: ''
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
    this.api.buyData(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status) {
        this.title = "Purchase successful"
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.storage.set("user", response.user)
        this.userData.setUser(response.user)
        this.userData.accountBalance = response.user.wallet_balance
        this.loader.dismiss()
        this.successPage()
      }
      else {
        // this.loader.dismiss()
        // this.action = response.action // && response.action === true ? true : false
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
    this.presentLoader()
    this.api.getProductList(this.details.network).subscribe(response => {
      console.log('Data response', response)
      if(response.status) {
        this.loader.dismiss()
        this.bundles = response.data.products
      }
      else {
        this.loader.dismiss()
      }
    })
  }

  selectBundle = () => {
    console.log(this.details.amount)
  }


}
