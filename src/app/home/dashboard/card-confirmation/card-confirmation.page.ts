import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-card-confirmation',
  templateUrl: './card-confirmation.page.html',
  styleUrls: ['./card-confirmation.page.scss'],
})
export class CardConfirmationPage implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  accountNumber: any
  bankName: any

  accept() {
    this.closeModal(true)
  }

  reject() {
    this.closeModal(false)
  }

  async closeModal(data) {
    const onClosedData: any = data;
    await this.modal.dismiss(onClosedData);
  }

}
