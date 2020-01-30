import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    private login: any
    public control = {
        state: false
    }

    constructor(login: FirebaseLoginService) { 
        this.login = login
    }

    ngOnInit() {
        this.login.check((state)=> {
            this.control.state = state
        })
    }

    public logOut() {
        this.login.denied()
    }

}
