import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserData } from 'src/app/providers/api/user-data.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  fullName:string;

  constructor(
    private router: Router,
    private userData: UserData,
    public loading: LoadingController,
    public toast: ToastController
  ) { }

  ngOnInit(){

      this.userData.getUser().then(response => {
        console.log('response', response)
        this.fullName = response.first_name +' '+ response.last_name;

    })
  }
  onClick = () => {
    this.router.navigate(['home/user/dashboard'])
  }
}
