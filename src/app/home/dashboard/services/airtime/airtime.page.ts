import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FailurePage } from '../../failure/failure.page';
import { SuccessPage } from '../../success/success.page';
import { TransactionConfirmationPage } from '../../transaction-confirmation/transaction-confirmation.page';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.page.html',
  styleUrls: ['./airtime.page.scss'],
})
export class AirtimePage implements OnInit {

  constructor(
    private navBack: NavigationService,
    private userData: UserData,
    private api: AppService,
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
        message: this.msg,
        title: this.title,
        action: this.action,
        bvn: this.bvn
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
      this.goBack();

    });
    return await modal.present();
  }

  async confirmTransaction() {
    const modal = await this.modal.create({
      component: TransactionConfirmationPage,
      componentProps: {
        type: 'airtime',
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


  ionViewWillEnter() {
    if(this.userData.categories === undefined) {
      this.api.getOperators('airtime').subscribe( response => {
        this.operators = response.data.services
        this.details.serviceId = response.data.id
      })
    }
    else {
      this.service = this.userData.categories.filter( category => category.type === 'airtime')
      this.operators = this.service[0].services
      //this.details.serviceId = this.operators[0].id
      //console.log(this.service)
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
  bvn = false
  transactionSuccess = false
  transactionError = false
  operators = []
  service = []
  msg: string
  title: string
  action: any
  details = {
    network: '',
    phoneNumber: '',
    amount: '',
    serviceId: '' 
  }
  transactionErrorMsg: any;

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
    this.api.buyAirtime(this.details).subscribe(response => {
      console.log('response', response)
      if(response.status) {
        this.title = "Purchase successful"
        this.loader.dismiss()
        this.storage.set("user", response.user)
        this.userData.userDetails = response.user
        this.userData.profile = response.user
        this.successPage()
      }
      else {
        this.loader.dismiss()
        if(response.message && response.message !== null) {
          this.msg = response.message
          this.title = "Operation failed"
          this.action = response.action
        }
        else {
            //this.msg = "Your transaction is processing"
            this.title = "Transaction is processing"
        }
        this.errorPage()
        
      }
    })
  }

  selectProvider = () => {
    let selected = this.operators.filter(service => service.name === this.details.network)
    this.details.serviceId = selected[0].id
  }



}
