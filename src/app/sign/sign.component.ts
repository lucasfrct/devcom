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
        mirror: "",
        toggleEye: this.ToggleEye,
        password: "password",
        eye: "visibility",
        bar: false,
        alerts: [],
        nameAlert: "",
        surnameAlert: "",
        telephoneAlert: "",
        emailAlert: "",
        passwordAlert: "",
    }

    public user = { 
        name: "", 
        surname: '',
        telephone: '',
        email:"", 
        password: "" 
    }

    constructor() { 
        this.sign = new FirebaseSignService

        //this.user = { name: "Lucas", surname: 'Costa', telephone: '(88) 99382-4305', email:"lucas@lucas.com-d", password: "123456" }
    }

    ngOnInit() { 

    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    public onSubmit(user: any){
        console.log("USER: ", user)
        var valid = this.validator(user)
        console.log(valid)
        
        if (valid.check) {
            this.control.bar = true

            this.sign.create(user, (response)=> {
                this.control.bar = false
                console.log("SIGN COMPONENT: ", response)
            })
        } else {
            this.control.alerts = valid.alerts
            console.log(this.control.alerts)
        }
    }

    private validator(user: any) {

        var valid = {
            alerts: [],
            check: false,
        }

        this.control.nameAlert = ""
        if(!name(user.name)) {
            valid.alerts.push("O nome precisa ter no mínimo 5 letras")
            this.control.nameAlert = "alert"
        }

        this.control.surnameAlert = ""
        if(!surname(user.surname)) {
            valid.alerts.push("O sobrenome precisa ter no mínimo 3 letras.")
            this.control.surnameAlert = "alert"
        }

        this.control.telephoneAlert = ""
        if(!telephone(user.telephone)) {
            valid.alerts.push("O telfone precisa ter no mínimo 11 números.")
            this.control.telephoneAlert = "alert"
        }

        this.control.emailAlert = ""
        if(!email(user.email)) {
            valid.alerts.push("Email inválido favor corrigir.")
            this.control.emailAlert = "alert"
        }

        this.control.passwordAlert = ""
        if(!password(user.password)) {
            valid.alerts.push("A senha precisa ter no mínimo 8 caracterres.")
            this.control.passwordAlert = "alert"
        }

        valid.check = (
            name(user.name) 
            && surname(user.surname) 
            && telephone(user.telephone) 
            && email(user.email) 
            && password(user.password)
        ) ? true : false

        return valid
          
        function name(name: String) {
            return (name.length >= 6) ? true : false
        }

        function surname(surname: String) {
            return (surname.length >= 3) ? true : false
        }

        function telephone(telephone: String) {
            return (telephone.length >= 11) ? true : false
        }

        function email(email: String) {
            return (email.length >= 6 && email.indexOf("@") && email.indexOf(".com")) ? true : false 
        }

        function password(password: String) {
            return (password.length >= 8) ? true : false
        }
    }

}
