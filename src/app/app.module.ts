import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaterialize } from '@smip/ngx-materialize';

//ANGULAR 

// components
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component'
import { FooterComponent } from './footer/footer.component'

@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        NgxMaterialize
    ],
    providers: [],
    bootstrap: [HeaderComponent, HomeComponent, FooterComponent]
})
export class AppModule { }
