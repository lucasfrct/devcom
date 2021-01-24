import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    private Login: any
    public control = {
        state: false
    }

    constructor(Login: FirebaseLoginService) { 
        
        this.Login = Login

    }

    ngOnInit() {

        this.Login.check((state)=> {
            this.control.state = state
        })
    }

    public logOut() {
        this.Login.denied()
    }

}
