import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { FailurePage } from '../failure/failure.page';
import { SuccessPage } from '../success/success.page';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  constructor(
    public modal: ModalController,
    public emodal: ModalController,
    public smodal: ModalController,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('this.type', this.action_type)
    console.log('this.user_id', this.user_id)
    this.next_of_kin.userid = this.user_id
    this.detail.userid = this.user_id
  }

  details = {
    //bvn: '',
    national_id: ''
  }

  next_of_kin :any

  detail = {
    userid: '',
    residential_address: ''
  }

  type: any
  message: string
  title: string
  action_type: any
  user_id: any

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles',
    })

    loader.present()
  }

  async closeModal(success = false) {
    const onClosedData: boolean = success;
    await this.modal.dismiss(onClosedData);
  }

    
  async errorPage() {
    const modal = await this.emodal.create({
      component: FailurePage,
      componentProps: {
        message: this.message,
        title: this.title
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
        title: 'Verification successful'
      }
    });

    modal.onDidDismiss().then(detail => {
      this.closeModal(true)
      //this.router.navigateByUrl("");
    });
    return await modal.present();
  }

  verify = (form) => {
    if(form.valid) { 
      this.presentLoader()
      this.api.kyc(this.details).subscribe(response => {
        if(response.status === true) {
          console.log('response', response)
          this.loader.dismiss();
          if(response.user && response.user !== null || response.user !== undefined) {
            this.storage.set("user", response.user)
          }
          this.successPage()
        }
        else {
          console.log('object ==>', response)
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Verification failed"
            //this.action = response.action
          }
          else {
              this.message = "Could not complete action, pleasetry again"
              this.title = "Verification failed"
          }
          this.errorPage()
        }
      })
    }
  }

  submitAddress = (adform) => {
    if(adform.valid) { 
      this.presentLoader()
      this.api.kyc(this.detail).subscribe(response => {
        if(response.status === true) {
          console.log('response', response)
          this.loader.dismiss();
          if(response.user && response.user !== null || response.user !== undefined) {
            this.storage.set("user", response.user)
          }
          this.successPage()
        }
        else {
          console.log('object ==>', response)
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Failed"
            //this.action = response.action
          }
          else {
              this.message = "Could not complete action, pleasetry again"
              this.title = "Failed"
          }
          this.errorPage()
        }
      })
    }
  }

  submitNextOfKin(kinform) {
    if(kinform.valid) {
      this.presentLoader()
      this.api.nexkOfKin(this.next_of_kin).subscribe(response => {
        if(response.status === true) {
          console.log('response', response)
          this.loader.dismiss();
          if(response.user && response.user !== null || response.user !== undefined) {
            this.storage.set("user", response.user)
          }
          this.successPage()
        }
        else {
          console.log('object ==>', response)
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Failed"
            //this.action = response.action
          }
          else {
              this.message = "Could not process your request, pleasetry again"
              this.title = "Failed"
          }
          this.errorPage()
        }
      })
    }
  }   
}
