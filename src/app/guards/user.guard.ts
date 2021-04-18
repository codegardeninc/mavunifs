import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { UserData } from '../providers/api/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanLoad {
  constructor(private router: Router, private userData: UserData, private storage: Storage) {}

  async canLoad(route: Route,segments: UrlSegment[]):  Promise<boolean>  {
    const is_user = await this.storage.get('user');
    console.log('is_user', is_user)
    if(is_user === null || is_user === undefined) {
      this.router.navigateByUrl('/home/auth/signup')   
    }
    else {
      return true
      // this.router.navigateByUrl('/home', { replaceUrl: true})
    }
  }
}
