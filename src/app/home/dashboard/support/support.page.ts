import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  constructor(
    private api: AppService,
    private userData: UserData,
    private router: Router,
    private toast: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tickets = this.userData.settings.tickets
    console.log(`this.tickets`, this.tickets)
  }

  tickets = []
  uid = this.userData.uid
  isEmpty = false
  all = true
  pending = false
  answered = false
  pendingTickets = [] 
  answeredTickets = [] 
  isNewTicket =  false
  details = {
    user_id: '',
    title: '',
    body: ''
  }
  async showLoader() {
    const loader = await this.loadingCtrl.create({}); 

    await loader.present();
  }

   async showToast(msg) {
    const toast = await this.toast.create({
      duration: 2000,
      message: msg,
      cssClass: 'toast'
    }); 

    await toast.present();
  }

  showForm() {
    this.isNewTicket = !this.isNewTicket
  }

  segmentChanged(ev: any) { 
    let page = ev.detail.value
    if(page === 'all') {
      this.all = true
      this.answered = false
      this.pending = false
      this.isNewTicket = false
    } 
    else if(page === 'pending') {
      this.pending = true
      this.all   = false
      this.answered = false
      this.isNewTicket = false
    }
    else if(page === 'answered') {
      this.all = false
      this.answered = true
      this.pending = false
      this.isNewTicket = false
    }
  }

  navigatePage(data) {
    this.router.navigate(['/user-dashboard/transactions/'+data])
  }

  onClick(id: Number) {
    let ticket = this.tickets.filter(ticket => ticket.id == id)
    let navExtra: NavigationExtras = {
      state: {
        ticket: ticket
      }
    }
    this.router.navigateByUrl('home/user/dashboard/support/response', navExtra)
  }
  submitTicket(form) {
    if(form.valid) {
      this.showLoader()
      this.api.submitTicket(this.details).subscribe(res => {
        console.log('res', res)
        if(res.status) {
          this.loadingCtrl.dismiss()
          console.log(res)
          this.isNewTicket = false
          this.tickets = this.tickets.concat(res.data)
          this.userData.tickets = this.userData.tickets.concat(res.data)
          this.showToast('Ticket submited')
        }
        else {
          this.loadingCtrl.dismiss()
          this.showToast(res.message) 
        }
      })
    }
  }
}
