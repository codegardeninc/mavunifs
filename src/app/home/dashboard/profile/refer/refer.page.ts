import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {
  referralEnteredCode:any;
  refer = true;
  enterCode = false;
  referralExists: any;
  constructor(
    private navBack: NavigationService,
    private userData: UserData,
    private storage: Storage, 
    private clipboard: Clipboard,
    public toast: ToastController,
    private social: SocialSharing
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('this.userData.userDetails', this.userData.userDetails)
    if(this.userData.userDetails === null || this.userData.userDetails === undefined) {
      this.storage.get("user").then(user => {
        console.log('object user', user)
        if(user.referral_earnings){
        this.balance = user.referral_earnings;
        }
        this.url = "com.app.mavunifs/home/user/profile/refer/"+this.refcode;
        this.refcode = user.account[0].account_number
      })
    }
    else {
      if(this.userData.referralEarnings){
        this.balance = this.userData.referralEarnings;
        }
      this.url = "com.app.mavunifs/home/user/profile/refer/"+this.refcode;
      this.refcode = this.userData.userDetails.account[0].account_number
    }

    this.text = "Hi, I just joined mavunifs and its a very lovely app, I will like you to join using my referral code: "+this.refcode
    this.url = "com.app.mavunifs/home/user/profile/refer/"+this.refcode;
  }

  balance: any = 0.00 
  name: string
  refcode: string = "BSP"
  text: string = "Hi, I just joined mavunifs and its a very lovely app, I will like you to join using my referal code: "
  url: string = "com.app.mavunifs/home/user/profile/refer/"+this.refcode;

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  async presentToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      position: "bottom",
      duration: 2000,
      cssClass: "toast"
    })
    toast.present() 
  }

  copy() {
    let message = this.text;
    this.clipboard.copy(message);
    this.presentToast("Copied")
  }

  shareGeneric() {
    const url = this.url
    const text = this.text
    this.social.share(text, 'Join mavunifs', null, url)
  }

  whatsappShare() {
    this.social.share(this.text, "Refer and earn", null, this.refcode)
   //this.social.shareViaWhatsAppToPhone("wahtsapp", this.text, this.url)
  }
  showReferCode(){
    this.refer = false;
    this.enterCode = true;
  }

  showReferralBox(){
    this.refer = true;
    this.enterCode = false;
  }

  submitRefCode(){
    this.presentToast("Sorry, referral is currently not active, please check back soon")

  }

}
