import { Component, OnInit } from '@angular/core';
import { FirebaseSignService } from './../firebase/firebase.sign.service'
import { UserService } from './../user/user.service'

@Component({
    selector: 'app-sign',
    templateUrl: './sign.component.html',
    styleUrls: ['./sign.component.css'],
})

export class SignComponent implements OnInit {

    private Sign: any
    private User: any
    
    private eye = "visibility"
    private password = "password"

    public control = {
        mirror: "",
        toggleEye: this.ToggleEye,
        password: "password",
        eye: "visibility",
        bar: false,
        alerts: {
            name: false,
            surname: false,
            telephone: false,
            bi: false,
            email: false,
            password: false,
        },
        notifications: [],
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
        bi: "",
        email:"", 
        password: "",
    }

    constructor(Sign: FirebaseSignService, User: UserService) { 
       
        this.Sign = Sign
        this.User = User

        this.user = { 
            name: "Cliente", 
            surname: 'cliente', 
            telephone: '935 964 737', 
            bi: "12345678900",
            email:"cliente@cliente.com-g", 
            password: "12345678",
        } 

        this.control.mirror = "12345678"
    }

    ngOnInit() { 
        this.Sign.check(null, 'sign')
    }

    private ToggleEye() {
        this.eye = (this.eye == "visibility" ) ? "visibility_off" : "visibility"
        this.password = (this.password == "password") ? "text" : "password"
    }

    public onSubmit(user: any){

        
        var valid = this.User.valid(user, this.control.mirror)

        this.control.alerts = valid.alerts

        this.control.notifications = valid.notifications

        if (valid.check) {
            this.control.bar = true

            this.Sign.create(user, (response)=> {

                this.control.bar = false
                this.control.modal = true
                this.control.message = response.message

                if ("201" == response.code) {
                    setTimeout(()=> {
                        this.Sign.redirect('perfil')
                    },1300)
                }
            })

        }
    }

}
