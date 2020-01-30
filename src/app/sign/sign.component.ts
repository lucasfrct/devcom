import { Component, OnInit } from '@angular/core';
import { FirebaseSignService } from './../firebase/firebase.sign.service'

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.css'],
})

export class SignComponent implements OnInit {

    private sign: any
    
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
        modal: false,
        message: ""
    }

    public user = { 
        name: "", 
        surname: '',
        telephone: '',
        email:"", 
        password: "" 
    }

    constructor(sign: FirebaseSignService) { 
        this.sign = sign

        //this.user = { name: "Lucas", surname: 'Costa', telephone: '(88) 99382-4305', email:"lucas@lucas.com-e", password: "12345678" } 
        //this.control.mirror = "12345678"
    }

    ngOnInit() { 
        this.sign.check(null, 'sign')
    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    public onSubmit(user: any){
        console.log("USER: ", user)
        var valid = this.validator(user)
        
        if (valid.check) {
            this.control.bar = true

            this.sign.create(user, (response)=> {
                this.control.bar = false
                this.control.modal = true
                this.control.message = response.message
                console.log("SIGN COMPONENT: ", response)
            })

        }
    }

    private validator(user: any) {
        const that = this

        const valid = { check: false }

        that.control.alerts = []
        that.control.nameAlert = ""
        that.control.surnameAlert = ""
        that.control.telephoneAlert = ""
        that.control.emailAlert = ""
        that.control.passwordAlert = ""

        if(!name(user.name)) {
            that.control.alerts.push("O nome precisa ter no mínimo 5 letras")
            that.control.nameAlert = "alert"
        }
        
        if(!surname(user.surname)) {
            that.control.alerts.push("O sobrenome precisa ter no mínimo 3 letras.")
            that.control.surnameAlert = "alert"
        }

        if(!telephone(user.telephone)) {
            that.control.alerts.push("O telfone precisa ter no mínimo 11 números.")
            that.control.telephoneAlert = "alert"
        }

        if(!email(user.email)) {
            that.control.alerts.push("Email inválido favor corrigir.")
            that.control.emailAlert = "alert"
        }

        if(!password(user.password, that.control.mirror)) {
            that.control.alerts.push("A senha precisa ter no mínimo 8 caracterres.")
            that.control.alerts.push("As senhas precisam ser iguais")
            that.control.passwordAlert = "alert"
        }

        valid.check = (
            name(user.name) 
            && surname(user.surname) 
            && telephone(user.telephone) 
            && email(user.email) 
            && password(user.password, that.control.mirror)
        ) ? true : false

        return valid
          
        function name(name: String) {
            return (name.length >= 3) ? true : false
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

        function password(password: String, mirror: String) {
            return (password.length >= 8 && password == mirror) ? true : false
        }
    }

}
