import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppService } from 'src/app/providers/api/app.service';
import { UserData } from 'src/app/providers/api/user-data.service';
import { NavigationService } from '../../../services/navigation.service'

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  constructor(
    private router: Router,
    private navBack: NavigationService,
    private api: AppService,
    private userData: UserData
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.categories = this.userData.categories
    this.searchResults = this.userData.categories
  }

  search = false
  categories = []
  searchResults = []

  onSearchChange = (data: any) => {
    let param = data.detail.value
    this.search = true
    this.searchResults = this.categories.filter(category => { 
      return category.name.toLowerCase().includes(param) || category.name.includes(param);
    })
  }

  gotoService = (page: any) => {
    //let page
     page = page === 'data_bundle' || page === 'internet_bundle' ? 'data-bundle': page
     page = page === 'cable_tv' ? 'cable-tv': page
     page = page === 'mobile_data' ? 'data': page
     page = page === 'fund_transfer' ? 'fund-transfer': page
     page = page === 'sme_data' ? 'sme-data': page
     page = page === 'result' ? 'not-found': page

    this.router.navigate(['home/user/dashboard/services/'+page]); 
  }

  goBack = () => {
    this.navBack.navigateToPreviousPage()
  }
}
