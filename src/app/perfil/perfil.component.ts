import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { FirebaseUserService } from './../firebase/firebase.user.service'
import { from } from 'rxjs';
import { ControlContainer } from '@angular/forms';

declare var M: any

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {

    private Login: any
    private User: any

    public user = {
        name: "",
        surname: "",
        bi: "",
        email: "",
        telephone: "",
        uid: "",
    }

    public control = {
        modal: false,
        bar: false,
        preload: false,
    }

    constructor(Login: FirebaseLoginService, User: FirebaseUserService) { 
        this.Login = Login
        this.User = User
    }

    ngOnInit() {
        this.control.preload = true

        this.Login.check(null, 'login')
        this.Login.scope((user)=> { 
            this.user.uid = user.uid
            this.load(user.uid)
        })
        
        M.updateTextFields()
        
    }

    load(uid: String) {
        var that = this
        that.control.preload = true
    
        that.User.load(uid, (response)=> {
            that.control.preload = false
            that.user = response.user
        })
    }

    public onEdit() {
        this.control.modal = !this.control.modal
        M.updateTextFields()
    }

    public onSave(user: Object) {
       
        this.control.modal = true
        this.control.bar = true

        this.User.setUid(this.user.uid)

        this.User.set(this.user, (response)=> {
            this.notify(response.message)
            this.control.modal = false
            this.control.bar = false
        })
    }

    public notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }

}
