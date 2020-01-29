import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { ModalDirective } from './modal/modal.directive'
import { FormSelectDirective } from './form/form.select.directive'

import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';
import { LoginComponent } from './login/login.component';

import { FirebaseInitService } from './firebase/firebase.init.service';
import { TicketsComponent } from './tickets/tickets.component';
import { ShopComponent } from './shop/shop.component'

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
    TicketsComponent,
    ShopComponent,
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
