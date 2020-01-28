import { Component, OnInit } from '@angular/core';
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { FirebaseLoginService } from './../firebase/firebase.login.service' 


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private login: FirebaseLoginService

    private eye = "visibility"
    private password = "password"

    public control = {
        toggleEye: this.ToggleEye,
        password: "password",
        eye: "visibility",
        bar: false,
        alerts: [],
        emailAlert: "",
        passwordAlert: "",
        modal: false,
        message: ""
    }

    public user = {
        email: "",
        password: "",
    }

    constructor() {
        this.login = new FirebaseLoginService(FirebaseInitService)
        //console.log("LOGIN COMPONENT - FIREBASE SERVICE CLASS: ", this.login)

        this.user = { email:"lucas@lucas.com-d", password: "12345678" } 
     }

    ngOnInit() {
    }

    public onSubmit(user: any) {
        console.log("LOGIN USER:", user)
        var valid = this.validate(user)
        
        if (valid.check) {

        }
        
    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    private validate(user: any) {
        const that = this
        var valid = { check: false }

        that.control.alerts = []
        that.control.emailAlert = ""
        that.control.passwordAlert = ""

        if (!email(user.email)) {
            that.control.alerts.push("O email está incorreto, favor digitar um email válido")
            that.control.emailAlert = "alert"
        }

        if (!password(user.password)) {
            that.control.alerts.push("A senha está incorreta ou insuficiente, favor digitar uma senha válida com mais de 8 caracteres")
            that.control.passwordAlert = "alert"
        }

        valid.check = (email(user.email) && password(user.password)) ? true : false

        return valid

        function email(email: String) {
            return (email.indexOf("@") != -1 && email.indexOf(".com") != -1 && email.length > 8) ? true : false
        }

        function password(password: String) {
            return (password.length >= 8) ? true : false
        }
    }

}
