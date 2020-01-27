import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent,
    SignComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [HeaderComponent, MainComponent, FooterComponent]
})

export class AppModule {}
