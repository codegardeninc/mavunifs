import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Events } from 'src/app/services/event.service';

@Injectable({
  providedIn: "root"
})
export class UserData {
  IS_LOGGED_IN = "hasLoggedIn";
  appSettings: any;
  userToken: any;
  userDetails: any;
  referralEarnings: any;
  cards = []
  operators = []
  transactions = []
  kin: any
  avatar: string
  service_type: string
  banks = []
  categories = []
  services = []
  loans = []
  banners: []
  tickets = []
  accountBalance = 0.00
  accountNumber: any
  mobileDataProviders = {
    providers: [],
    serviceId: '',
    service: {} 
  }
  settings: any
  uid: any
  profile: any
  SEEN_WALK_THROUGH: any
  investments = []
  notifications = []

  constructor(public events: Events, public storage: Storage) {}

  login(user): Promise<any> { 
    return this.storage.set(this.IS_LOGGED_IN, true).then(() => {
      this.storage.remove('user');
      this.setUser(user);
      this.userDetails = user;
      this.accountBalance = user.wallet_balance
      this.setSeenWalkThrough()
      this.setBalance(user.wallet_balance);
      this.accountNumber = user.account[0].account_number
      this.avatar = user.kyc.profile_photo 
      this.transactions = user.transactions
      this.investments = user.investments
      this.cards = user.cards
      this.profile = user
      return this.events.publish("user:login");
    });
  }

  setSeenWalkThrough() {
    this.storage.set(this.SEEN_WALK_THROUGH, true);
  }

  signup(user: any): Promise<any> {
    return this.storage.set(this.IS_LOGGED_IN, true).then(() => {
      this.setUser(user);
      this.userDetails = user;
      this.accountBalance = user.wallet_balance
      this.setSeenWalkThrough()
      this.setBalance(user.wallet_balance);
      this.accountNumber = user.account[0].account_number
      this.avatar = user.kyc.profile_photo
      return this.events.publish("user:signup");
    });
  }

  logout(): Promise<any> {
    return this.storage
      .set(this.IS_LOGGED_IN, false)
      .then(() => {
        return this.storage.remove("ACCESS_TOKEN");
      })
      .then(() => {
        this.userDetails = "";
      });
  }

  setUser(user: string): Promise<any> {
    return this.storage.set("user", user);
  }

  setToken(token: string): Promise<any> {
    return this.storage.set("ACCESS_TOKEN", token);
  }
 
  setBalance(balance: number): Promise<any> {
    return this.storage.set("balance", balance);
  }

  getToken(): Promise<any> {
    return this.storage.get("ACCESS_TOKEN").then(value => {
      return value;
    });
  }
  getUser(): Promise<any> {
    return this.storage.get("user").then(value => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.IS_LOGGED_IN).then(value => {
      return value === true;
    });
  }

  seenWalkThrough(): Promise<boolean> {
    return this.storage.get(this.SEEN_WALK_THROUGH).then(value => {
      return value === true;
    });
  }

  removeWalkthrough(): Promise<boolean> {
    return this.storage.set(this.SEEN_WALK_THROUGH, false)
  }
  
}
