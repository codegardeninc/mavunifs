import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  constructor(
    public smodal: ModalController
  ) { }

  ngOnInit() {
  }

  // ionViewWillEnter() {
  //   if(this.title === null ||this.title === undefined) {
  //     this.title = 'Transaction Successful'
  //   }
  // }

  title: string
  creditToken: string

  async closeModal(success = true) {
    const onClosedData: boolean = success;
    await this.smodal.dismiss(onClosedData);
  }

}
