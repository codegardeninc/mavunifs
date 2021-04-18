import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-card-verification',
  templateUrl: './card-verification.page.html',
  styleUrls: ['./card-verification.page.scss'],
})
export class CardVerificationPage implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.type === 'otp') {
      this.placeholder = "Enter OTP"
    }
    else {
      this.placeholder = " Enter Phone number"
    }
  }

  // otp: string = ''
  // phoneNumber: string = ''
  type: string
  inputvalue: string = ''
  message: string 
  placeholder: string = 'Enter OTP or Phone number'

  accept(form) {
    console.log('this.inputvalue', this.inputvalue)
    if(form.valid) {
      let data = {
        inputvalue: form.value,
        status: true,
        type: ''
      }
      this.closeModal(data)
    }
  }

  reject() {
    this.closeModal(false)
  }

  async closeModal(data) {
    const onClosedData: any = data;
    await this.modal.dismiss(onClosedData);
  }

}

