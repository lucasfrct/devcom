import { Component, OnInit } from '@angular/core';
import { UrlService } from './../home/url.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    private Url: any
    private uri: any
    private token: String

    private check: any

    public control = {
        modalTicket: false,
        modalMessage: "",
    }
  
    public constructor(Url: UrlService) { 
        this.Url = Url
    }

    public ngOnInit() {
        this.checkTicket()
    }

    public checkTicket() {
        
        if (this.Url.params("checkin")) {
            
            this.control.modalTicket = true
            this.control.modalMessage = this.Url.params("checkin")
            console.log("DATA: ", this.control.modalMessage)

        }
    }
}
