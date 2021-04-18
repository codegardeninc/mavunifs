import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-confirmation',
  templateUrl: './transaction-confirmation.page.html',
  styleUrls: ['./transaction-confirmation.page.scss'],
})
export class TransactionConfirmationPage implements OnInit {

  constructor(
    public modal: ModalController
  ) { }

  ngOnInit() {
  }

  displayInfo = {
    description: '',
    amount: '',
  }

  type: string
  details: any
  detail: any
  info: any
  discount: any
  status = false

  accept() {
    this.closeModal(true)
  }

  reject() {
    this.closeModal(false)
  }

  ionViewWillEnter() {
    console.log('type', this.details)
    if(this.type === 'card') {
      this.displayInfo.description = 'This card will be removed from your account'
    }
    
    
    if(this.type === 'withdrawal') {
      console.log('this.detail', this.detail)
      if(this.detail === null || this.detail === undefined) {
        this.displayInfo.amount = this.details.amount
        this.displayInfo.description = "Bank: "+this.details.bank+ 
        "\n Account Number: "+this.details.accountNumber+"\n Account Name: "+this.details.accountName+"\n"
      }
      else { 
        this.displayInfo.amount = this.details.amount
        this.displayInfo.description = this.detail.message
      }
    }

    if(this.type === 'airtime') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = this.details.network+' airtime topup for '+this.details.phoneNumber
    }

    if(this.type === 'data' || this.type === 'mobile_data' || this.type === 'mobile data') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = this.details.network+' mobile data subscription for '+this.details.phoneNumber
    }

    if(this.type === 'sme data' || this.type === 'data_bundle' || this.type === 'internet_bundle' || this.type === 'data bundle' || this.type === 'internet bundle') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = this.info
    }

    if(this.type === 'electricity') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = 'Meter topup for '+this.details.customerName+"\n to meter number "+this.details.meterNo
      
    }

    if(this.type === 'cable' || this.type === 'cable_tv') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = 'You are about to purchase the '+this.details.packageName+" subscription for the smartcard number "+this.details.smartCardNo+" belonging to "+this.details.customerName;
    }

    if(this.type === 'savings' || this.type === 'saving') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = 'You are about to make a savings of '+ this.displayInfo.amount +
        ' this amount will be charged from your '+ this.details.payment_method
    }

    if(this.type === 'wallet_withrawal' || this.type === 'wallet_withdrawals') {
      this.displayInfo.amount = this.details.amount
      this.displayInfo.description = 'Withdraw ZAR'+ this.displayInfo.amount +
        ' from savings balance.'
    }
  }

  async closeModal(success = false) {
    const onClosedData: boolean = success;
    await this.modal.dismiss(onClosedData);
  }

}
