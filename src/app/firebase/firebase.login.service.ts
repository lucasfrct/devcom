/*
 * firebase.login.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { FirebaseInitService } from './../firebase/firebase.init.service'


@Injectable({
    providedIn: "root"
})

export class FirebaseLoginService {

    private init: any
    private scope: any
    private firebase: any
    private db: any
    private response: any
    private router: any
    
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(init: FirebaseInitService, router: Router) {
        this.init = init
        this.scope = this.init.scope
        this.firebase = this.init.on()
        this.db = this.init.db()
        this.response = this.init.response()
        this.Subscribe = this.init.Subscribe
        this.NotifyAll = this.init.NotifyAll
        this.copy = this.init.copy
        this.extend = this.init.extend
        this.router = router
    }

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().signInWithEmailAndPassword(email, password)
    }

    public check(callback: any, path= 'home') {
        var that = this
        that.scope((user)=> { 
            if (null == user) { that.redirect(path) }
            if (typeof callback == "function") { callback((null != user)) }
        })
    }

    public access(user: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        if (null == that.firebase.auth().currentUser) {
            var Login = that.CallSignEmail(user.email, user.password)
            that.response.user = that.firebase.auth().currentUser
            Login
                .then((user)=>{
                    that.response.code = "201"
                    that.response.message = "Sessão iniciada com sucesso!"
                }).catch((error)=>{
                    that.response.error = error
                    that.response = that.extend(that.response, that.ErrorHandle(error.code))
                }).finally(()=>{
                    that.NotifyAll(that.response)
                })
        } else {
            that.response.code = "200"
            that.response.message = "Sessão atualizada com sucesso"
            that.NotifyAll(that.response)
        }  
    }

    public denied(callback: any){
        
        this.Subscribe(callback)

        if (null != this.firebase.auth().currentUser) { 
            this.firebase.auth().signOut()
            this.response.user = null
            this.response.code = "200"
            this.response.message = "Sessão terminada pelo usuário"
        }
        
        this.NotifyAll(this.response)
    }

    public redirect(path) {
        this.router.navigate([path])
    }

    private ErrorHandle(error: any) {
        var err = { code: "", message: "" }
        switch(error) {
            case "auth/wrong-password":
                err.code = "400"
                err.message = "A senha está errada."
                break
            case "auth/too-many-requests":
                err.code = "400"
                err.message = "Muitas tenataivas erradas. Favor tente novamente mais tarde"
                break
            case "auth/user-not-found":
                err.code = "400"
                err.message = "este email não está registrado"
                break
            default:
                err.code = "400"
                err.message = "algum erro foi encontrado."
                break
        }
        return err
    }
   
}