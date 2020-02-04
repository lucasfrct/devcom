import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'

/*======== DIRECTIVES =========*/
import { ModalDirective } from './modal/modal.directive'
import { FormSelectDirective } from './form/form.select.directive'
import { SidenavDirective } from './sidenav/sidenav.directive'

/*======== SERVICES =========*/

import { FirebaseInitService } from './firebase/firebase.init.service'
import { QRCodeModule } from 'angularx-qrcode';

/*======== FILTERS =========*/
import { BuyPurchaseFilter } from './buy/buy.purchase.filter'

/*======== COMPONENTS =========*/
import { HeaderComponent } from './header/header.component'
import { MainComponent } from './main/main.component'
import { FooterComponent } from './footer/footer.component'
import { HomeComponent } from './home/home.component'
import { SignComponent } from './sign/sign.component'
import { LoginComponent } from './login/login.component'
import { TicketComponent } from './ticket/ticket.component'
import { ShopComponent } from './shop/shop.component'
import { BuyComponent } from './buy/buy.component'
import { AboutComponent } from './about/about.component'
import { PaymentComponent } from './payment/payment.component'
import { CheckinComponent } from './checkin/checkin.component'
import { PerfilComponent } from './perfil/perfil.component'

@NgModule({
  declarations: [
    ModalDirective,
    FormSelectDirective,
    SidenavDirective,
    BuyPurchaseFilter,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent,
    SignComponent,
    LoginComponent,
    TicketComponent,
    ShopComponent,
    BuyComponent,
    AboutComponent,
    PaymentComponent,
    CheckinComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    QRCodeModule,
  ],
  providers: [FirebaseInitService],
  bootstrap: [HeaderComponent, MainComponent, FooterComponent]
})

export class AppModule {}
