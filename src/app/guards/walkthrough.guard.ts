import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { UserData } from '../providers/api/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class WalkthroughGuard implements CanLoad {

  constructor(private router: Router, private userData: UserData, private storage: Storage) {}

  async canLoad(route: Route,segments: UrlSegment[]):  Promise<boolean>  {
    const seen = await this.storage.get('SEEN_WALK_THROUGH');
    if(seen === true) {
      return true      
    }
    else {
      this.router.navigateByUrl('/home', { replaceUrl: true})
    }
  }
}
