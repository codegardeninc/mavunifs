import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-create-pin',
  templateUrl: './create-pin.page.html',
  styleUrls: ['./create-pin.page.scss'],
})
export class CreatePinPage implements OnInit {
  pin:string;
  pin2:string;
  errorMsg;any;
  phonenumber:any;
  constructor(private router: Router, private navBack: NavigationService,
    ) { }

  ngOnInit() {
    if(this.router.getCurrentNavigation().extras.state) {
    this.phonenumber = this.router.getCurrentNavigation().extras.state.phonenumber; 
    console.log("poo", this.phonenumber)
    } else
    {
      this.router.navigate(['/'])
    }
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }

  onClick = () => {
    const pinlength = this.pin.toString().length;
    console.log('Pin leng', pinlength)
    if(pinlength < 6){
      this.errorMsg = 'Pin Must be up to 6 digits';
    } else {
      if(this.pin === this.pin2){
        let navEx: NavigationExtras = {
          state: {
            phonenumber: this.phonenumber,
            password: this.pin
          }
        }
        this.router.navigate(['/home/auth/register'], navEx)

      } else {
        this.errorMsg = 'Pin does not match';
      } 
    }
    
  }
}
