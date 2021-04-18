import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'

import { Observable, throwError, from } from 'rxjs'
import {catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private storage: Storage, 
    private alertCtrl: AlertController,
    private toast: ToastController,
    private router: Router
  ) { }

  msg: string;
  errors: any

  async showToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      duration: 5000,
      buttons: ['OK'],
      cssClass: 'toast'
    });
   await toast.present()
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      message: this.msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let promise = this.storage.get('ACCESS_TOKEN');

    return from(promise).pipe(
      mergeMap( token => {
        let cloneReq = this.addToken(request, token);        
        return next.handle(cloneReq).pipe(
           catchError(error => {
             console.log('expired =>', error.code)
            if(error.error.code == 401) {
              this.storage.set('hasLoggedIn', false)
              this.showToast('Please Login')
              this.router.navigateByUrl('home/auth/login');
            }
             this.errors = error.error
             //this.showToast(JSON.stringify(error.error.errors))
             console.error('An HTTP ERROR OCCURED: ', error.error)

             return throwError(error)
          })
        )
      })
    )
  }

  private addToken(request: HttpRequest<any>, token: any) {
    if (token) {
        let clone: HttpRequest<any>;
        clone = request.clone({
            setHeaders: {
                //'Accept': `application/json`,
                //'Content-Type': `application/json`,
                'Authorization': `Bearer ${token}`
            }
        });
        return clone;
    }

    return request;
  }
}
