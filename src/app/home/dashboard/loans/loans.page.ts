import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../services/navigation.service'
import { ConfirmationPage } from '../confirmation/confirmation.page';
import { SuccessPage } from '../success/success.page';
import { FailurePage } from '../failure/failure.page';
import { VerificationPage } from '../verification/verification.page';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
}) 
export class LoansPage implements OnInit {

  constructor(
    private router: Router, 
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData,
    public loader: LoadingController,
    public toast: ToastController,
    private modal: ModalController,
    public smodal: ModalController,
    public fmodal: ModalController
  ) { }

  ngOnInit() { 
  }

  ionViewWillEnter() {
    this.profile = this.userData.profile
    if(this.userData.loans === undefined) {
      this.api.getLoans().subscribe(response => {
        if(response.status) {
          this.loans = response.data
        }
      })
    }
    else {
      this.loans = this.userData.loans
    }

    this.interest = this.interest = (this.details.amount * this.details.duration) / 100
    this.api.getSettings().subscribe(response => {
      console.log('all Loans response', response)
      if(response.status) {
        this.userData.settings = response.data
        this.loans = response.data.loans
      }
    })
    
    if(this.userData.settings === undefined) { 
      this.api.getUserLoans().subscribe(response => {
        console.log('Loans response', response)
        this.myLoans = response.data
        this.approved = response.data.filter(loan => loan.approval_status.toLowerCase() === 'approved')
        this.activeLoan = response.data.filter(loan => loan.is_settled == 0 && loan.approval_status.toLowerCase() === 'approved')
      })
    }
    else {
      console.log('this.userData.settings.user_loans', this.userData.settings.user_loans)
      this.myLoans = this.userData.settings.user_loans
      this.approved = this.userData.settings.user_loans.filter(loan => loan.approval_status.toLowerCase() === 'approved')
      this.activeLoan = this.userData.settings.user_loans.filter(loan => loan.is_settled == 0 && loan.approval_status.toLowerCase() === 'approved')
    }
  }

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      position: 'middle',
      cssClass: 'toast',
      duration: 1000
    })

    toast.present();
  }

  async presentLoader() {
    let loader = await this.loader.create({
      spinner: 'bubbles'
    })

    loader.present();
  }

  profile: any
  loan = true;
  apply = false
  repay = false;
  showForm = false;
  message: string 
  show = true
  confirmation = false
  interest = 0.00
  price_range = 0
  max_duration = 10
  max_amount = 5000
  loans = []
  approved = []
  activeLoan = []
  myLoans = []
  verification_type

  details = {
    loan_id: '',
    amount: 5000.00,
    duration: 30,
  }
  title: any

  async errorPage() {
    const modal = await this.fmodal.create({
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
        title: this.title
      }
    });

    modal.onDidDismiss().then(detail => {
      this.loan = true
      this.repay = false
      this.apply = false
      this.api.getSettings().subscribe(response => {
        //this.presentLoader()
        console.log('all Loans response', response)
        if(response.status) {
         // this.loader.dismiss()
          this.userData.settings = response.data
          this.myLoans = response.data.user_loans
          this.approved = response.data.user_loans.filter(loan => loan.approval_status.toLowerCase() === 'approved')
          this.activeLoan = response.data.user_loans.filter(loan => loan.is_settled == 0 && loan.approval_status.toLowerCase() === 'approved')
        }
        // else {
        //   this.loader.dismiss()
        // }
      })
  
      // this.api.getLoans().subscribe(response => {
      //   if(response.status) {
      //     this.loans = response.data
      //   }
      // })
    });
    return await modal.present();
  }
  
  async confirmTransaction() {
    const modal = await this.modal.create({
      component: ConfirmationPage,
      componentProps: {
         transaction: this.loan,
         transaction_id: this.details.loan_id,
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
  
  async verify() {
    const modal = await this.modal.create({
      component: VerificationPage,
      componentProps: {
         type: this.verification_type
      }
    });

    modal.onDidDismiss().then(detail => {
    });
    return await modal.present();
  }

  switchPage = (trans: any) => {
    this.api.getSettings().subscribe(response => {
      console.log('this.loans tab', response)
      if(response.status) {
        this.loans = response.data.loans
      }
    })
    let page = trans.detail.value
    if(page === 'loan') {
      this.loan = true
      this.repay = false
      this.apply = false
    }
    else if(page === 'apply') {
      this.apply = true
      this.repay = false
      this.loan = false
    }
    else if(page === 'repay') {
      this.repay = true
      this.apply = false
      this.loan = false
    }
    else {
      this.loan = true
      this.repay = false
      this.apply = false
    }
  }
  

  onClick = (form) => {
    if(form.valid) {
      this.presentLoader()
      this.api.applyLoan(this.details).subscribe(response => {
        console.log('response', response)
        if(response.status === true) {
          this.loader.dismiss()
          this.myLoans.push(response.data)
          this.title = "Loan request successful"
          this.successPage()
        }
        else if(response.code === 'bvn') {
          this.loader.dismiss()
          this.verification_type = 'bvn'
          //this.verify()
          this.router.navigateByUrl("home/user/profile/kyc")
        }
        else {
          this.loader.dismiss()
          if(response.message && response.message !== null) {
            this.message = response.message
            this.title = "Operation failed"
            //this.action = response.action
          }
          else {
              this.message = "Could not complete action, please try again"
              this.title = "Operation failed"
          }
          this.errorPage()
        }
      })
    }
  }

  pay(form) {
    let loan = this.myLoans.filter(ln => ln.is_settled == 0 && ln.approval_status.toLowerCase() === 'approved')
    console.log('loan', loan)
    this.details.amount = Number(loan[0].amount) + Number(loan[0].interest)
    this.details.loan_id = loan[0].id
    this.presentLoader()
    this.api.repayLoan(this.details).subscribe(response => {
      console.log('response repay', response)
      if(response.status) {
        this.loader.dismiss()
        const index = this.myLoans.indexOf(loan)
        if(index > -1) {
          this.myLoans.splice(index, 1)
        }
        this.title = response.message
        this.successPage()
      }
      else {
        // this.loader.dismiss()
        // this.message = response.message
        // this.title = "Operation failed"
        // this.errorPage()
        this.loader.dismiss()
        if(response.message && response.message !== null) {
          this.message = response.message
          this.title = "Operation failed"
          //this.action = response.action
        }
        else {
            //this.message = "Your transaction is processing"
            this.title = "Transaction is processing"
        }
        this.errorPage()
      }
    })
  
  }

  payNow = (form) => {
    if(form.valid) {
      this.presentLoader()
      this.api.verifyBVN(this.details).subscribe(response => {
        if(response.status) {
          this.loader.dismiss();
        }
        else {
          this.loader.dismiss()
        }
      })
    }
  }

  withdraw = () => {
    this.router.navigate(['home/user/savings/withdraw']);
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  rangeChange(data: any) {
    let amount = data.detail.value
    this.details.amount = amount
    this.interest = (this.details.amount * this.details.duration) / 100
  }

  intervalChange(data: any) {
    let duration = data.detail.value
    this.details.duration = duration
    this.interest = (this.details.amount * duration) / 100
  }

  getStarted() {
    this.apply = true
    this.repay = false
    this.loan = false
  }

  selectLoan() {
    let loan = this.loans.filter(loan => loan.id == this.details.loan_id)   
    this.max_amount = Number(loan[0].max_amount)
    this.max_duration = Number(loan[0].max_duration)
    this.details.duration = loan[0].max_duration
    this.details.amount = loan[0].max_amount
    console.log('loan', loan)
    console.log('this.details.loan_id', this.details.loan_id)
  }


}
