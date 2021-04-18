import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';

@Component({
  selector: 'app-response',
  templateUrl: './response.page.html',
  styleUrls: ['./response.page.scss'],
})
export class ResponsePage implements OnInit {


  constructor(
    private api: AppService,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private userData: UserData,
    private route: ActivatedRoute,
    private storage: Storage,
  ) {
      this.route.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation().extras.state) {
          this.ticket = this.router.getCurrentNavigation().extras.state.ticket
          this.replies = this.ticket[0].replies
        }
        else {
          this.storage.get('ticket_id').then(ticket_id => {
            this.api.getTicket(ticket_id).subscribe(response => {
              console.log('object R', response)
              if(response.status) {
                this.ticket = [response.data]
                this.replies = this.ticket[0].replies
              }
            })
          })
        }
      })
   }

  ngOnInit() {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'toast',
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.replies = this.ticket[0].replies
    this.uid = this.userData.profile.id
    this.details.user_id = this.userData.profile.id
    this.details.ticket_id = this.ticket[0].id
  }

  replies = []
  image = []
  ticket: any
  ticketId: Number
  uid: any

  details = {
    ticket_id: '',
    attachment: '',
    body: '',
    user_id: ''
  }

  submit(form) {
    this.presentLoading()
    if(form.valid) {
      this.api.replyTicket(this.details).subscribe(resp => {
        if(resp.status) {
          this.loadingController.dismiss()
          this.replies = this.replies.concat(resp.data)
          this.details.body = ''
          this.presentToast(resp.message)
        } 
        else {
          this.loadingController.dismiss()
          this.presentToast(resp.message)
        }
      })
      // if(form.valid) {
      // }
    }
  }

}
