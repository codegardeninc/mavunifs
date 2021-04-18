import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.page.html',
  styleUrls: ['./topup.page.scss'],
})
export class TopupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showForm = false;
  transactionSuccess = false;
  show = true
  segment = false

  onClick() {
    this.showForm = true
    this.show = true
  }

  segmentChanged = (page: any) =>  {
    this.segment = true
  }

  hideForm() {
    this.showForm = false
    this.transactionSuccess = false
  }

  creditWallet() {
    this.transactionSuccess = true
    this.show = false
  }
}
