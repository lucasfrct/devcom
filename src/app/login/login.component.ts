import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service' 


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private Login: any
    private eye = "visibility"
    private password = "password"

    public extend: any
    public copy: any

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

    constructor(Login: FirebaseLoginService) {
        this.Login = Login

        this.extend = Login.extend
        this.copy = Login.copy
        this.user = { email:"cliente@cliente.com", password: "12345678" } 
     }

    ngOnInit() {
        this.Login.check(null, 'login')
    }

    public onSubmit(user: any) {
        
        if (this.valid(user).check) {
            
            this.control.bar = true
            
            this.Login.access(user, (response)=>{
                
                this.control.bar = false
                this.control.modal = true;
                this.control.message = response.message
                
                setTimeout(()=> {
                    this.Login.redirect('perfil')
                }, 1300)
            })
        }
    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    private valid(user: any) {

        var valid = { check: false }

        this.control.alerts = []
        this.control.emailAlert = ""
        this.control.passwordAlert = ""

        if (!email(user.email)) {
            this.control.alerts.push("O email está incorreto, favor digitar um email válido")
            this.control.emailAlert = "alert"
        }

        if (!password(user.password)) {
            this.control.alerts.push("A senha está incorreta ou insuficiente, favor digitar uma senha válida com mais de 8 caracteres")
            this.control.passwordAlert = "alert"
        }

        valid.check = (email(user.email) && password(user.password)) ? true : false

        

        function email(email: String) {
            return (email.indexOf("@") != -1 && email.indexOf(".com") != -1 && email.length > 8) ? true : false
        }

        function password(password: String) {
            return (password.length >= 8) ? true : false
        }

        return valid
    }

    public logOut() {
        this.Login.denied()
    }

}
