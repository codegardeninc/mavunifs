import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry, IWriteOptions } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

const STORAGE_KEY = 'photo';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  constructor(
    private router: Router,
    private api: AppService,
    private userData: UserData,
    public loading: LoadingController,
    public toast: ToastController,
    private nav: NavigationService,
    private camera: Camera,
    private file: File,
    private ashtCtrl: ActionSheetController,
    private webView: WebView,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('this.userData.profile', this.userData.profile)
    if(this.userData.profile === undefined) {
      this.userData.getUser().then(response => {
        console.log('response', response)
        this.profile = response
        this.userData.profile = response
        this.profileDetails.dob = response.kyc.dob
        this.profileDetails.first_name =  response.first_name
        this.profileDetails.last_name = response.last_name
        this.profileDetails.gender = response.gender
        this.profileDetails.phone_number = response.phone_number
        this.profileDetails.email = response.email
        this.profileDetails.userid = response.id
        this.profile_photo = response.kyc.profile_photo
      })
    }
    else {
      this.profile = this.userData.profile
      this.profileDetails.dob = this.profile.kyc.dob
      this.profileDetails.first_name =  this.profile.first_name
      this.profileDetails.last_name = this.profile.last_name
      this.profileDetails.gender = this.profile.gender
      this.profileDetails.phone_number = this.profile.phone_number
      this.profileDetails.email = this.profile.email
      this.profileDetails.userid = this.profile.id
      this.profile_photo = this.profile.kyc.profile_photo
    }

  }

  edit = false 
  profile: any
  profile_photo: string
  image = []
  showOption = false
  croppedImagePath: any;
  
  profileDetails = {
    userid: '',
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    email: '',
    phone_number: '',  
    
  }

  goBack() {
    this.nav.navigateToPreviousPage()
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      targetHeight: 100,
      targetWidth: 100
    }
    
     this.camera.getPicture(options).then((imageData) => {
        this.profile_photo  = this.webView.convertFileSrc(imageData);
          this.showOption = true
         //this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
         this.file.resolveLocalFilesystemUrl(imageData)
         .then(entry => {
             ( < FileEntry > entry).file(file => this.croppedImagePath = file)
         })
         .catch(err => {
             this.presentToast('Error while reading file.');
         });
    }, (err) => {
    });
  }

  async selectImage() {
    const actionSheet = await this.ashtCtrl.create({
      header: "Select Image source",
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
      await actionSheet.present();
  }

  startUpload() {
    this.readFile(this.croppedImagePath)
  }
 
  async uploadImageData(formData: FormData) {
   
    this.presentLoading()
    this.api.kyc(formData).subscribe(response => {
      this.presentToast(response)
      if(response.status === true) {
        this.loading.dismiss()
        this.showOption = false
        this.userData.setUser(response.user)
        this.userData.profile = response.user
        this.userData.userDetails = response.user
        this.profile_photo = response.user.kyc.profile_photo
        this.presentToast('Upload successful');
      }
      else {
        this.loading.dismiss()
        if(response.message && response.message !== null) {
          this.presentToast('Upload failed')
          this.showOption = false 
        }
        else {
            this.presentToast("Could not complete action, please try again")
        }
      }
    })
  
    
  
  }

  readFile(file: any) {
    const reader = new FileReader(); 
    reader.onload = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        formData.append('userId', this.profile.id);
        formData.append('photo', imgBlob, file.name);          
        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
}


  onClick = () => {
  }

  cancel() {
    this.nav.navigateToPreviousPage()
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 6000,
      cssClass: 'toast',
      position: 'middle'
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
      if(this.userData.profile.kyc.bvn && this.userData.profile.kyc.bvn !== ''){
        return alert("You have verified your account. If you have need to modify your profile, kindly send an email to our support")
      } else {
        this.presentLoading()
        this.api.updateProfile(this.profileDetails).subscribe(response => {
          console.log('response', response)
          if(response.status === true) {
            this.loading.dismiss()
            this.profile = response.data
            this.userData.profile = response.data
            this.userData.userDetails = response.data
            this.userData.setUser(response.data)
            this.profileDetails.first_name = response.data.first_name
            this.profileDetails.last_name = response.data.last_name
            this.profileDetails.gender = response.data.gender
            this.profile_photo = response.data.kyc.profile_photo
            this.profileDetails.dob = response.data.kyc.dob
            this.userData.setUser(response.data)
            this.presentToast('Profile Saved')
          }
          else {
            this.loading.dismiss()
            if(response.message && response.message !== null) {
              this.presentToast(response.message)
            }
            else {
                this.presentToast("Could not complete action, Try again")
            }
          }
        })
      }
    }

  }

  hideOption() {
    this.showOption = false
    this.profile_photo = this.profile.kyc.profile_photo
  }

}
