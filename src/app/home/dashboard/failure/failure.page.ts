import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-failure', 
  templateUrl: './failure.page.html',
  styleUrls: ['./failure.page.scss'],
})
export class FailurePage implements OnInit {

  constructor(
    public fmodal: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if(this.withdrawalMsg && this.withdrawalMsg === true) {
      this.msg = "Please check the account number and try again"
    }

    if(this.action === 'bvn') {
      this.label = "VerifyBVN"
    }
    else if(this.action === 'add-card') {
      this.label = "Add a Card Card"
    }
    else if(this.action === 'card') {
      this.label = "Set default Card"
    }
    else if(this.action === 'wallet') {
      this.label = "Fund wallet"
    }
    else {
      this.label = "BACK"
    }
  }


  act: string
  bvn = false
  message: string
  title: string 
  cardMsg = false
  action = ''
  withdrawalMsg = false 
  msg: string = ""
  label: string
  funct: any
  async closeModal(success = false) {
    const onClosedData: boolean = success;
    await this.fmodal.dismiss(onClosedData);
  }


  addCard() {
    this.fmodal.dismiss()
    this.router.navigateByUrl("/home/user/wallet/cards/add-card")
  } 

  setDefaultCard() {
    this.fmodal.dismiss()
    this.router.navigateByUrl("/home/user/wallet/cards")
  } 

  verifyBvn() {
    this.fmodal.dismiss()
    this.router.navigateByUrl("/home/user/profile/kyc")
  }

  fundWallet() {
    this.fmodal.dismiss()
    this.router.navigateByUrl("/home/user/wallet")
  }

  doAction() {
    if(this.action === 'bvn') {
      this.verifyBvn()
    }
    else if(this.action === 'card') {
      this.setDefaultCard()
    }
    else if(this.action === 'add-card') {
      this.addCard()
    }
    else if(this.action === 'wallet') {
      this.fundWallet()
    }
    else {
      this.closeModal()
    }
  }

}
