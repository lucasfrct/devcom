import { Component, OnInit } from '@angular/core';
import { FirebaseSignService } from './../firebase/firebase.sign.service'

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.css']
})

export class SignComponent implements OnInit {

    private sign: FirebaseSignService
    
    private eye = "visibility"
    private password = "password"

    public control = {
        mirror: "123456",
        toggleEye: this.ToggleEye,
        password: "password",
        eye: "visibility",
        bar: false,
    }

    public user = { 
        name: "Lucas", 
        surname: 'Costa',
        telephone: '(88) 99382-4305',
        email:"lucas@lucas.com", 
        password: "123456" 
    }

    constructor() { 
        this.sign = new FirebaseSignService
    }

    ngOnInit() { 

    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    public onSubmit(user: any){

        this.control.bar = true

        this.sign.create(user, (response)=> {
            this.control.bar = false
            console.log("SIGN COMPONENT: ", response)
        })
    }

}
