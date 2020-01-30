import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { FirebaseInitService } from './firebase/firebase.init.service';

import { AppRoutingModule } from './app-routing.module';
import { ModalDirective } from './modal/modal.directive'
import { FormSelectDirective } from './form/form.select.directive'

import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';
import { LoginComponent } from './login/login.component';

import { TicketComponent } from './ticket/ticket.component';
import { ShopComponent } from './shop/shop.component';
import { BuyComponent } from './buy/buy.component';

@NgModule({
  declarations: [
    ModalDirective,
    FormSelectDirective,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent,
    SignComponent,
    LoginComponent,
    TicketComponent,
    ShopComponent,
    BuyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [FirebaseInitService],
  bootstrap: [HeaderComponent, MainComponent, FooterComponent]
})

export class AppModule {}
