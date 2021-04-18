import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string 
  msg: string
  username: string
  lastName: string
  categories: []
  dataExists = true
  data: any
  loginParams = {
    password: '',
    email: ''
  }
  isSubmitted =  false;
  errorMsg:any;
  

  constructor(
    private router: Router,
    private userData: UserData,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private api: AppService,
    private storage: Storage,
    private route: ActivatedRoute
  ) {
    this.storage.get('user').then(user => {
      console.log('Wh', user)
        if(user) {
          this.username = user.last_name+' '+user.first_name
          this.lastName =user.last_name
          this.loginParams.email =user.email
        }
        else {
          this.router.navigateByUrl('/home/auth/signup')
          this.getUser()
        }
      })
   }

  ngOnInit() {
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({     
      message: msg,
      duration: 1500,
      position: 'middle',
      cssClass: 'toast'
    })

    await toast.present()
  }

  async shwoAlert(msg) {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['Ok']
    })

    await alert.present()
  }

  async onReg() {
    await this.storage.remove('user');
    this.router.navigate(['/home/auth/signup'])
  }

  async showLoader() {
    let loading = await this.loadingCtrl.create({
      //duration: 8000
      message: 'please wait',
      spinner: 'bubbles'
    })
    await loading.present()
  } 

  forgotPassword() {
    this.router.navigate(['/newlogin'])
  }

  register() {
    this.router.navigate(['/newlogin'])
  }
  forgotPin(){
    this.router.navigate(['/home/auth/forgot-password'])
  }

  login(form) {
    this.isSubmitted = true
    this.errorMsg = false
    if(form.value.password === '') {
      this.showToast('Enter a password')
    }

    if(form.valid) {
      this.showLoader()
      this.errorMsg == undefined;
      this.api.login(this.loginParams).subscribe(async res => {
        console.log('res as', res)
        if(res.status === true) {
          await this.storage.remove('user');
          this.loadingCtrl.dismiss()
          this.errorMsg = ''
          this.userData.login(res.user)
          this.userData.setToken(res.access_token)
          let navigationExtras: NavigationExtras = {
            state: {
              user: res.user,
            }
          }
          this.userData.uid = res.user.id
          this.router.navigateByUrl('/home/user/dashboard', navigationExtras)
        }
        else {
          this.loadingCtrl.dismiss()
          // if(res.message && res.message !== null) {
            this.errorMsg = "Invalid PIN";
            this.showToast('Invalid PIN')
          // }
          // else {
          //   this.showToast("Could not complete action, Try again")
          // }
        }
      })
    }
  }

  async getUser() {
    await this.storage.get('user').then(user => {
      if(user !== null) {
        this.loginParams.email = user.email
        this.username = user.first_name+' '+user.last_name
        this.lastName = user.last_name
        this.dataExists = true
      }
    })
  }
}
