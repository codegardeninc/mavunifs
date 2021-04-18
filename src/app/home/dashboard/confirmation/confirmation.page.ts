import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { SuccessPage } from '../../../home/dashboard/success/success.page';
import { FailurePage } from '../../../home/dashboard/failure/failure.page';
import { AppService } from 'src/app/providers/api/app.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  constructor(
    private fmodal: ModalController,
    private smodal: ModalController,
    private modal: ModalController,
    public toastCtrl: ToastController,
    private api: AppService,
    public alertCtrl: AlertController,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
  }

  display_photo: string
  message: string
  transaction: any
  transaction_id: any
  trsnsaction_type: string
  transaction_status = false

  async closeModal(success = false) {
    const onClosedData: boolean = success;
    await this.modal.dismiss(onClosedData);
    // this.router.navigateByUrl('home/dashboard/failure')
  }

    
  async failedTransaction(message) {
    const modal = await this.fmodal.create({
      component: FailurePage,
      componentProps: {
         message: message,
      }
    });

    modal.onDidDismiss().then(detail => {
    });
    return await modal.present();
  }
    
  async successTransaction(transaction) {
    const modal = await this.smodal.create({
      component: SuccessPage,
      componentProps: {
          transaction: this.transaction,
          transaction_id: this.transaction_id,
          transaction_type: this.trsnsaction_type
      }
    });

    modal.onDidDismiss().then(detail => {
      // if (detail !== null) {
      //   if (detail.data) {
      //     this.updateLocalBalance();
      //     this.getAllTransactions();
      //   }
      //   console.log("The result:", detail);
      // }
    });
    return await modal.present();
  }

  confirmTransaction() {
    console.log('this.transaction =>', this.transaction)
    if (this.transaction.type === "airtime") {
      this.api.buyAirtime(this.transaction).subscribe(response => {
        if (response.success) {
          this.successTransaction(response.message)
          // this.showAlert(
          //   "Airtime Recharge of " +
          //     this.transaction.vendor +
          //     " ZAR" +
          //     this.transaction.amount +
          //     " was successfull",
          //   response.success
          // );
          console.log("transacion", response);
        }
      });
    }

    if (this.transaction.type === "data") {
      this.api.buyData(this.transaction).subscribe(response => {
        if (response.success) {
          this.successTransaction(response.messasge)
          // this.showAlert(response.message, response.success);
          console.log("transaction", response);
        }
      });
    }

    if (this.transaction.type === "electricity") {
      this.transaction.amt = this.transaction.amount;
      this.api.buyElectricity(this.transaction).subscribe(response => {
        if (response.success) {
          if (response.data.ResponseCode == "90000") {
            const msg =
              "<p>Recharge was successfull, the recharge PIN has been sent to your registered email (please check token in inbox, spam/Junk) and phone number. <br />  You can also tap the 'Copy PIN' button below to copy the PIN and share or save somewhere </p> PIN: " +
              response.data.Pin;
            this.showToken(msg, response.data.Pin, response.success);
            console.log("transacion", response);
          } else {
            this.failedTransaction(response.message);
          }
        }
      });
    }
    if (this.transaction.type === "cable_tv") {
      this.transaction.amt = this.transaction.amount;
      console.log(this.transaction);
      this.api.buyCable(this.transaction).subscribe(response => {
        if (response.success) {
          if (response.data.ResponseCode == "90000") {
            const msg =
              "<p>Renewal of your " +
              this.transaction.vendor +
              " was successfull, Kindly restart your decoder or follow the instruction for activating your subscription as provided by the Cable TV Operator. <br />  </p> Transaction Ref: " +
              response.data.TransactionRef;
            // this.showTransactionRef(
            //   msg,
            //   response.data.TransactionRef,
            //   response.success
            // );
          } else {
            this.failedTransaction(response.message);
          }
        }
      });
    }
  }

  async showToken(msg, pin, success = false) {
    const alert = await this.alertCtrl.create({
      header: "Info",
      subHeader: "Recharge Operation Successful",
      message: msg,
      buttons: [
        {
          text: "Copy PIN",
          handler: () => {
            this.copyToken(pin);
          }
        },
        {
          text: "Okay",
          handler: () => {
            this.closeModal(success);
          }
        }
      ]
    });
    await alert.present();
  }

  async showTransactionRef(msg, pin, success = false) {
    const alert = await this.alertCtrl.create({
      header: "Info",
      subHeader: "Recharge Operation Successful",
      message: msg,
      buttons: [
        {
          text: "Copy",
          handler: () => {
            this.copyToken(pin);
          }
        },
        {
          text: "Okay",
          handler: () => {
            this.closeModal(success);
          }
        }
      ]
    });
    await alert.present();
  }

  copyToken(pin) {
    this.clipboard.copy(pin);
    this.toast();
    this.closeModal(true);
  }

  async toast() {
    const toast = await this.toastCtrl.create({
      message: "Copied to Clipboard",
      duration: 2000
    });
    toast.present();
  }

}
