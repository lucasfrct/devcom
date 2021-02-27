import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'

@Component({
    selector: 'app-checkin',
    templateUrl: './checkin.component.html',
    styleUrls: ['./checkin.component.css']
})

export class CheckinComponent implements OnInit {

    private Login: any 

    constructor(Login: FirebaseLoginService) { 
        this.Login = Login
    }

    ngOnInit() {
        this.Login.check(null, 'login')
    }

}
