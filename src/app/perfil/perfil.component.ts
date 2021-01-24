import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { UserService } from './../user/user.service'

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
        uid: "",
        name: "",
        surname: "",
        bi: "",
        email: "",
        telephone: "",
    }

    public control = {
        modal: false,
        bar: false,
        preload: false,
    }

    constructor(Login: FirebaseLoginService, User: UserService) { 
        this.Login = Login
        this.User = User
    }

    ngOnInit() {
        this.control.preload = true

        this.Login.check(null, 'login')

        this.Login.scope((user)=> { 
            if (user && user.uid.length > 15 ) { 
                this.user.uid = user.uid 
            }
            this.load()
        })
        
    }

    public load() {
        var that = this
        that.control.preload = true
        
        that.User.setUid(this.user.uid)
        that.User.load((response)=> {
            that.control.preload = false
            that.user = response.user
        })
    }

    public onEdit() {
        this.control.modal = !this.control.modal
    }

    public onSave() {
       
        this.control.modal = true
        this.control.bar = true

        this.User.setUid(this.user.uid)
        this.User.current = this.user

        this.User.update((response)=> {
            this.user = response.user
            this.User.notify(response.message)
            this.control.modal = false
            this.control.bar = false
        })
    }
}