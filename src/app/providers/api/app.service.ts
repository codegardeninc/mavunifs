// http.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap, retry } from "rxjs/operators";
import { UserData } from "./user-data.service";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  ToastController
} from "@ionic/angular";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: "root"
})

export class AppService {
  apiUrl = environment.baseUrl;
  userDetails: any;
  uuid: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': "application/json",
      "Content-Type": "application/json"
    })
  };
  constructor(
    public toast: ToastController,
    private http: HttpClient,
    private user: UserData,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {}
  async getUser() {
    this.user.getUser().then(details => {
      this.userDetails = details.data;
    });
    return this.userDetails;
  }
  async getUserId() {
    await this.storage.get("user").then(value => {
      this.userDetails = JSON.parse(value);
      this.uuid = this.userDetails.uuid;
      if (this.uuid && this.uuid != "") {
        console.log(this.uuid);
      } else {
        console.log(this.uuid);
      }
    });
    return this.uuid;
  }

  verifyOtp(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/auth/verify`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Verify Otp", []))
      );
  }

  resendOtp(assets): Observable<any> {
    console.log('sent', assets)
    return this.http
      .post(`${environment.baseUrl}/auth/otp`, assets)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Get Token", []))
      );
  }

  buyAirtime(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/buy-airtime`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Buy Airtime ", []))
      );
  }

  verify(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/verify`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Verify ", []))
      );
  }

  tvPlans(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/cable-tv/list`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Verify ", []))
      );
  }

  buyCheapData(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/sme-data`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("SME Data ", []))
      );
  }

  buyData(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/buy-data`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Mobile Data ", []))
      );
  }

  dataBundle(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/buy-databundle`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Data Bundle ", []))
      );
  }

  buyElectricity(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/buy-electricity`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Electricity ", []))
      );
  }

  buyCable(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http
      .post(`${environment.baseUrl}/bills/buy-cable`, attributes)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("TV Subscription", []))
      );
  }

  confirmPassword(password): Observable<any> {
    console.log("sent", password);
    return this.http.post(`${environment.baseUrl}/auth/confirm-password`, password).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Forgot Password", []))
    );
  } 

  verifyAccount(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/services/verify-account`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Bank account", []))
    ); 
  }

  updateProfile(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.put(`${environment.baseUrl}/account/${attributes.userid}`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Profile", []))
    );
  }

  createUser(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/account/create`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Profile", []))
    );
  }


  verifyBVN(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/auth/verify-bvn`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("BVN ", []))
    );
  }
  

  resetPassword(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/auth/reset-password`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Chnage Password", []))
    );
  }

  forgotPassword(attributes) {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/auth/forgot-password`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Forgot Password", []))
    );
  }

  addCard(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/card/add`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Add card", []))
    );
  }

  removeCard(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.delete(`${environment.baseUrl}/transaction/card/${attributes}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Remove card", []))
    );
  }

  setCard(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.get(`${environment.baseUrl}/transaction/card/set-default/${attributes}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("set card", []))
    );
  }

  login(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/login`, attributes).pipe(
      tap((data) => this.log("response received")),
      catchError(this.handleError("Login", []))
    );
  }

  checkUser(user): Observable<any> { 
    return this.http.post(`${environment.baseUrl}/auth/checker`, user).pipe(
      tap( res => console.log('response received')),
      catchError(this.handleError("Check user", []))
    )
  }


  getCards(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/transaction/cards`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("cards", []))
    );
  }

  deleteCard(cardId): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/transaction/card/${cardId}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("cards", []))
    );
  }

  kyc(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/account/kyc`,attributes).pipe(
      tap(_ => this.log("kyc response received")),
      catchError(this.handleError("KYC", []))
    );
  }

  nexkOfKin(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/account/next-of-kin`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Next of Kin", []))
    );
  }

  quickSave(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/quick-save`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Deposit", []))
    );
  }

  saveToWallet(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/wallet-withdrawal`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("In-app Deposit", []))
    );
  }

  fundWallet(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/wallet-topup`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Deposit", []))
    );
  }

  saveSettings(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/settings/autosave`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Settings", []))
    );
  }

  getSettings(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/transaction/settings`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Settings", []))
    );
  }

  withdrawal(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/withdraw`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Withdrawal", []))
    );
  }

  register(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/account/create`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Signup", []))
    );
  }

  applyLoan(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/loan`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Loan application", []))
    );
  }

  repayLoan(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/loan/pay`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Loan repayment", []))
    );
  }

  getInvestments(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/transaction/investments`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Investments", []))
    );
  }

  invest(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/transaction/invest`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Investment application", []))
    );
  }

  getLoans(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/services/loans`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Loans", []))
    );
  }

  getUserLoans(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/transaction/user-loans`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("User Loans", []))
    );
  }

  verifyTransfer(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/service/verify-transfer`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Verification", []))
    );
  }

  fundTransfer(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/services/fund-transfer`, attributes).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Fund transfer", []))
    );
  }

  getBanks(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/transaction/banks`).pipe(
      tap(() => this.log("response receiveed")), 
      catchError(this.handleError("Banks", []))
    );
  }

  getBanners(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/services/banners`).pipe(
      tap(() => this.log("response received")), 
      catchError(this.handleError("Banners", []))
    );
  }

  getServices(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/services/categories`).pipe(
      tap(() => this.log("response received")), 
      catchError(this.handleError("Services", []))
    );
  }

  getOperators(type): Observable<any> {
    return this.http.get(`${environment.baseUrl}/services/categories/${type}`).pipe(
      tap(() => this.log("response received")), 
      catchError(this.handleError("Get Providers", []))
    );
  }

  getCableOperators(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/cable-tv`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Get Electricity Providers", []))
    );
  }

  getElectricityOperators(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/electricity`).pipe(
      tap(_ => this.log("response received")),
      retry(1),
      catchError(this.handleError("Get Electricity Providers", []))
    );
  }

  readNotification(id): Observable<any> {
    return this.http.get(`${this.apiUrl}/transaction/settings/notification/${id}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Read notification", []))
    );
  }

  getAllTransactions(id): Observable<any> {
    return this.http.get(`${this.apiUrl}/transaction/user/${id}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("getAllTransactions", []))
    );
  }

  confirmMeterNo(meterno, vendor_code, amt): Observable<any> {
    return this.http
      .get(
        this.apiUrl +
          "confirm-meterno?vendor_code=" +
          vendor_code +
          "&meterno=" +
          meterno +
          "&amount=" +
          amt
      )
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Confirm Meter Number", []))
      );
  }

  confirmSmatcardNo(smartcardno, vendor_code, amt): Observable<any> {
    return this.http
      .get(
        this.apiUrl +
          "cable-verify-details?vendor_code=" +
          vendor_code +
          "&smartcardno=" +
          smartcardno +
          "&amount=" +
          amt
      )
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Confirm Smartcard Number", []))
      );
  }

  getDataBundles(vendorcode): Observable<any> {
    return this.http
      .get(`${environment.baseUrl}/services/data-plan/${vendorcode}`)
      .pipe(
        tap(_ => this.log("response received")),
        catchError(this.handleError("Get Data Plans", []))
      );
  }

  getProductList(vendor): Observable<any> {
    return this.http.get(`${environment.baseUrl}/bills/list/${vendor}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Product list", []))
    );
  }

  getUserProfile(userID): Observable<any> {
    return this.http.get(`${environment.baseUrl}/account/${userID}`).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Get Profile", []))
    );
  }

  tickets(uid): Observable<any> {
    console.log("sent", uid);
    return this.http.get(`${environment.baseUrl}/support/${uid}`, this.httpOptions).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Tickets", []))
    );
  }

  submitTicket(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/support/ticket`, attributes, this.httpOptions).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Ticket reply", []))
    );
  }

  replyTicket(attributes): Observable<any> {
    console.log("sent", attributes);
    return this.http.post(`${environment.baseUrl}/support/ticket/reply`, attributes, this.httpOptions).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Ticket reply", []))
    );
  }

  getTicket(ticketId): Observable<any> {
    console.log("sent", ticketId);
    return this.http.get(`${environment.baseUrl}/support/tickets/${ticketId}`, this.httpOptions).pipe(
      tap(_ => this.log("response received")),
      catchError(this.handleError("Ticket", []))
    );
  }  

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {

      console.log(">>>>>", error.error); 

      //this.showToast(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
    return message;
  }
  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      header: "An Error Occurred",
      message: msg,
      animated: true,
      cssClass: 'toast',
      duration: 6000,
      buttons: [
        {
          text: "Okay",
          handler: () => {}
        }
      ]
    });
    await toast.present();
  }
}
