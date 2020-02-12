import { Component, OnInit } from '@angular/core';
import { FirebaseSignService } from './../firebase/firebase.sign.service'
import { UserService } from './../user/user.service'
import { FormService } from './../form/form.service'

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.css'],
})

export class SignComponent implements OnInit {

    private Sign: any
    private User: any
    private Form : any
    
    private eye = "visibility"
    private password = "password"

    public recaptcha: any

    public tgg: any

    public control = {
        bar: false,
        barCode: false,
        modal: false,
        modalCode: false,
        mirror: "",
        message: "",
        password: "password",
        eye: "visibility",
        notifications: [],
        alerts: {
            name: false,
            surname: false,
            telephone: false,
            bi: false,
            email: false,
            password: false,
        },
    }
    
    public user = { 
        name: "", 
        surname: '',
        telephone: '',
        bi: "",
        email:"", 
        password: "",
        code: "",
    }

    constructor(Sign: FirebaseSignService, User: UserService, Form: FormService) { 
       
        this.Sign = Sign
        this.User = User
        this.Form = Form

        this.user.name = "Cliente"
        this.user.surname = 'cliente'
        this.user.telephone = '+244555555555' //'935 964 737' 
        this.user.bi = "12345678900"
        this.user.email = "cliente@cliente.com"
        this.user.password = "12345678"
        this.user.code = ""

        this.control.mirror = "12345678"
    }

    ngOnInit() { 
        this.Sign.check(null, 'sign')
        this.Sign.reCaptcha ()
    }

    public ToggleEye () {
        this.control.eye = this.Form.toggleEye()
        this.control.password = this.Form.togglePassword()
    }

    public onSubmit(user: any){

        var valid = this.User.valid(user, this.control.mirror)

        this.control.alerts = valid.alerts

        this.control.notifications = valid.notifications

        if (valid.check) {
        
            this.control.bar = true

            this.Sign.create(user, (response)=> {

                console.log("CREAtE", response)
                
                this.control.bar = false
                this.control.modal = true
                this.control.message = response.message

                if ("201" == response.code) {
                    setTimeout(()=> {
                        this.Sign.redirect('perfil')
                    }, 1300)
                }
            })

        }
    }

    public onSendSMS(user: any) {

        this.control.bar = true
        this.control.message = "Enviando SMS... Espere um pouco."
        
        this.Sign.sendSms(user.telephone, (response)=> {
            this.control.bar = false
            this.control.modalCode = true
            this.control.message = response.message

        })
    }

    public onSendCode(user: any) {
        
        this.control.modalCode = true

        this.Sign.sendCode(user, (response)=> {

            if ("201" == response.code) {
                
                this.control.modalCode = false
                
                setTimeout(()=> {
                    this.Sign.redirect('perfil')
                }, 1300)

            }

        })

    }

}
