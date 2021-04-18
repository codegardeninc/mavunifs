import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  phoneNumber:any;
  password:any;
  password_confirmation: any;
  profileDetails: any = {};
  create = false 
  profile: any
  profile_photo: string

  constructor(
    private router: Router,
    private api: AppService,
    private userData: UserData,
    public loading: LoadingController,
    public toast: ToastController,
  ) { }

  ngOnInit() {
    if(this.router.getCurrentNavigation().extras.state) {
    this.profileDetails.phone_number = this.router.getCurrentNavigation().extras.state.phonenumber; 
    this.profileDetails.password = this.router.getCurrentNavigation().extras.state.password;
    this.profileDetails.password_confirmation = this.router.getCurrentNavigation().extras.state.password;
    console.log("u", this.profileDetails);
  } else{
    this.router.navigate(['/home/auth/signup'])
  }
  }

  ionViewWillEnter() {
    console.log('this.userData.profile', this.userData.profile)
    // if(this.userData.profile === undefined) {
    //   this.userData.getUser().then(response => {
    //     console.log('response', response)
    //     this.profile = response
    //     this.userData.profile = response
    //     this.profileDetails.dob = response.kyc.dob
    //     this.profileDetails.first_name =  response.first_name
    //     this.profileDetails.last_name = response.last_name
    //     this.profileDetails.gender = response.gender
    //     this.profileDetails.phone_number = response.phone_number
    //     this.profileDetails.email = response.email
    //     this.profileDetails.userid = response.id
    //     this.profile_photo = response.kyc.profile_photo
    //   })
    // }
    // else {
    //   this.profile = this.userData.profile
    //   this.profileDetails.dob = this.profile.kyc.dob
    //   this.profileDetails.first_name =  this.profile.first_name
    //   this.profileDetails.last_name = this.profile.last_name
    //   this.profileDetails.gender = this.profile.gender
    //   this.profileDetails.phone_number = this.profile.phone_number
    //   this.profileDetails.email = this.profile.email
    //   this.profileDetails.userid = this.profile.id
    //   this.profile_photo = this.profile.kyc.profile_photo
    // }

  }

  goBack = () => {
    this.router.navigateByUrl('home/auth/signup')
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 6000,
      cssClass: 'toast'
    });
    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loading.create({
      //duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  updateData(form) {
    if(form.valid) {
      this.presentLoading()
      this.api.createUser(this.profileDetails).subscribe(response => {
        console.log('response', response)
        if(response.status) {
          this.loading.dismiss()
          this.profile = response.user
          this.userData.profile = response.user
          this.profileDetails.first_name = response.user.first_name
          this.profileDetails.last_name = response.user.last_name
          this.profileDetails.gender = response.user.gender
          this.profile_photo = response.user.kyc.profile_photo
          this.profileDetails.dob = response.user.kyc.dob
          this.userData.setUser(response.user)
          this.userData.login(response.user)
          //this.presentToast('Profile Saved')
          this.router.navigateByUrl('/home/welcome')
        }
        else {
          this.loading.dismiss()
          this.presentToast(response.message)
        }
      })
    }
  }

}
