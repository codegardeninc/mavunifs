import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { InterceptorService } from './services/interceptor.service';
import { IonicStorageModule } from '@ionic/storage';
import { ConfirmationPage } from './home/dashboard/confirmation/confirmation.page';
import { SuccessPage } from './home/dashboard/success/success.page';
import { FailurePage } from './home/dashboard/failure/failure.page';
import { VerificationPage } from './home/dashboard/verification/verification.page';
import { TransactionConfirmationPage } from './home/dashboard/transaction-confirmation/transaction-confirmation.page';
import { Base64 } from '@ionic-native/base64/ngx';
import { CardVerificationPage } from './home/dashboard/card-verification/card-verification.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CardConfirmationPage } from './home/dashboard/card-confirmation/card-confirmation.page';
import { DEFAULT_TIMEOUT, TimeoutinterceptorService } from './services/timeoutinterceptor.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FlutterwaveModule } from 'flutterwave-angular-v3';



@NgModule({
  declarations: [
    AppComponent, 
    ConfirmationPage, 
    SuccessPage, 
    FailurePage, 
    VerificationPage,
    TransactionConfirmationPage,
    CardVerificationPage,
    CardConfirmationPage
  ],
  entryComponents: [
    ConfirmationPage, 
    SuccessPage, 
    FailurePage, 
    VerificationPage,
    TransactionConfirmationPage,
    CardVerificationPage,
    CardConfirmationPage
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule,
    FlutterwaveModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    WebView,
    Base64,
    FilePath,
    Clipboard,
    SocialSharing,
    InAppBrowser,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutinterceptorService, multi: true, deps: [DEFAULT_TIMEOUT]},
    { provide: DEFAULT_TIMEOUT, useValue: 60000 }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
