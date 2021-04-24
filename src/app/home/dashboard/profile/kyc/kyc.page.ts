import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { VerificationPage } from '../../verification/verification.page';
import { ConfirmationPage } from '../../confirmation/confirmation.page';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.page.html',
  styleUrls: ['./kyc.page.scss'],
})
export class KycPage implements OnInit {

  constructor(
    private navBack: NavigationService, 
    private router: Router,
    private file: File,
    private camera: Camera,
    private webView: WebView,
    private ashtCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private loading: LoadingController,
    private api: AppService,
    private userData: UserData,
    public modal: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  async profileModal() {
    const modal = await this.modal.create({
      component: ConfirmationPage,
      componentProps: {
        display_photo: this.displayData,
        message: this.message
      }
    });

    modal.onDidDismiss().then(detail => {

    });
    return await modal.present();
  }

  async showVerificationForm() {
    const modal = await this.modal.create({
      component: VerificationPage,
      componentProps: {
        action_type: this.action_type,
        user_id: this.user_id
      }
    });

    modal.onDidDismiss().then(detail => {
      this.storage.get('user').then(user => {
        this.profile = user
        this.national_id = user.kyc.national_id
        this.means_of_id = user.kyc.means_of_identity
        this.profile_photo = user.kyc.profile_photo
        this.residential_address = user.kyc.residential_address
        this.next_of_kin = user.next_of_kin
      })
    });
    return await modal.present();
  }


  ionViewWillEnter() {
    this.profile = this.userData.profile
    this.photo = this.userData.profile.kyc.profile_photo
    this.next_of_kin = this.userData.profile.kin
    this.bvn = this.userData.profile.kyc.bvn
    this.national_id = this.userData.profile.kyc.national_id
    this.means_of_id = this.userData.profile.kyc.means_of_identity
    this.residential_document = this.userData.profile.kyc.residential_document
    this.residential_address = this.userData.profile.kyc.residential_address
    this.user_id = this.userData.profile.id
    this.kyc = this.userData.profile.kyc
    if(this.kyc.status && this.kyc.status == 1) {
      this.badge_flag = 'true'
    }
    else {
      this.badge_flag = 'false'
    }
    console.log('this.means_of_id', this.badge_flag)
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  kyc:any
  badge_flag = 'false'
  user_id: ''
  action_type = ''
  displayData: any
  showOption = false
  profile: any
  show = false
  next_of_kin = ''
  bvn: any
  national_id: any
  showBvn = false
  showMeans = false 
  showPhoto = false
  isPhoto = false
  isMeans = false
  isbvn = false
  means_of_id: any
  residential_document: any
  residential_address: ''
  photo: any
  croppedImagePath: any 
  profile_photo: any
  reqOption: string
  message: string
  imageurl: string
  isResidential_document = false

  async presentLoading() {
    const loading = await this.loading.create({});
    loading.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'middle',
        duration: 3000,
        cssClass: 'toast'
    });
    toast.present();
  }
   
  verifyBvn() {
    if(this.national_id === null || this.national_id === undefined) {
      this.showBvn = false
      this.isbvn = false
      this.action_type = 'national_id'
      this.showVerificationForm()
    }
    else {
      //this.showBvn = true
      console.log('this.bvn', this.bvn)
      this.isbvn = true
      this.show = true
      this.showOption = true
    }
    
  }
   
  nextofKin() {
    if(this.next_of_kin === null || this.next_of_kin === undefined) {
      //this.showMeans = false
      this.action_type = 'next_of_kin'
      this.showVerificationForm()
    }
    else {
      this.showMeans = true
    }
  }
   
  resiAddress() {
    console.log(this.residential_address)
    if(this.residential_address === null || this.residential_address === undefined) {
      //this.showMeans = false
      this.action_type = 'resi_address'
      this.showVerificationForm()
    }
    else {
      this.showMeans = true
    }
  }
   
  verifyMeansOfId() {
    if(this.means_of_id === null || this.means_of_id === undefined) {
      this.showMeans = false
      this.action_type = 'means_of_id'
      this.showVerificationForm()
    }
    else {
      this.showMeans = true
    }
  }
   
  uploadProfilePhoto() {
    if(this.photo === null || this.photo === undefined || this.photo === "https://app.mavunifs.com/storage/profile_photos/no-image.jpg") {
      this.showPhoto = false
      this.showVerificationForm()
    }
    else {
      this.showPhoto = true
    }
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
    }
    
     this.camera.getPicture(options).then((imageData) => {
          this.imageurl  = this.webView.convertFileSrc(imageData);
          this.showOption = false
          this.show = true
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

  async selectImage(option: any) {
    if(option === 'photo') {
      this.showPhoto = false
      this.isPhoto =  true
      this.isMeans = false
      this.isResidential_document = false      
      // if(this.photo === null || this.photo === undefined || this.photo.includes("no-image.jpg")) { 
      //   this.showPhoto = false
      //   this.isPhoto =  true
      //   this.isMeans = false
      //   this.isResidential_document = false
      // }
      // else {
      //   this.show = true
      //   this.showOption = true
      //   this.isbvn = false
      //   this.displayData = this.photo
      //   this.message = "Profile photo"
      //   console.log('this.photo', this.photo)
      //   this.profileModal();
      //   return;
      // }
    }
    else if(option === 'means_of_id') {
      if(this.means_of_id === null || 
        this.means_of_id === undefined || 
        !this.means_of_id.toLowerCase().includes('.jpeg') || 
        !this.means_of_id.toLowerCase().includes('.jpg') || 
        !this.means_of_id.toLowerCase().includes('.png') || 
        !this.means_of_id.toLowerCase().includes('.svg') ||
        !this.means_of_id.toLowerCase().includes('.gif')        
        ) { 
        this.isMeans = true
        this.isPhoto = false
        this.showMeans = false
      }
      else {
        this.show = true
        this.showOption = true
        this.isbvn = false
        this.displayData = this.means_of_id
        this.message = "Means of Identification"
        console.log('this.means_of_id', this.means_of_id)
        this.profileModal()
        return;
      }
    }
    else if(option === 'residential_document') {
      console.log(`this.residential_document`, this.residential_document)
      if(this.residential_document === null || 
        this.residential_document === undefined || 
        !this.residential_document.toLowerCase().includes('.jpeg') || 
        !this.residential_document.toLowerCase().includes('.jpg') || 
        !this.residential_document.toLowerCase().includes('.png') || 
        !this.residential_document.toLowerCase().includes('.svg') ||
        !this.residential_document.toLowerCase().includes('.gif')
        ) { 
        this.isMeans = false
        this.isPhoto = false
        this.showMeans = false
        this.isResidential_document = true
      }
      else {
        this.show = true
        this.showOption = true
        this.isbvn = false
        this.displayData = this.residential_document
        this.message = "Proof of Address"
        console.log('this.residential_document', this.residential_document)
        this.profileModal()
        return;
      }
    }

    let buttons = [
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
     let sheet_title = 'Select Image Source'

    if(this.isPhoto === true) {
      sheet_title = 'Open Camera'
      buttons = [
        {
          text: 'Take a Selfie',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }

    const actionSheet = await this.ashtCtrl.create({
      header: sheet_title,
      buttons: buttons
    });
      await actionSheet.present();
  }

  startUpload() {
    if(this.isPhoto) {
      this.reqOption = 'photo'
    }
    else if(this.isResidential_document) {
      this.reqOption = 'residential_document'
    }
    else if(this.isMeans){
      this.reqOption = 'means_of_id'
    }
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
          this.message = response.message
        }
        else {
            this.presentToast("Coult not complete action, please try again")
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
        formData.append(this.reqOption, imgBlob, file.name);          
        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  hideOption() {
    this.showOption = false
    this.profile_photo = this.profile.kyc.profile_photo
  }

}
