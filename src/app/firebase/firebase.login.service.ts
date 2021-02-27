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

    private scope: any
    private firebase: any
    private response: any
    private Router: any
    
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService, Router: Router) {

        this.scope = Init.scope
        this.firebase = Init.on()

        this.response = Init.response()
        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend
        this.Router = Router

    }

    private CallSignEmail(email: String, password: String) {
        return this.firebase.auth().signInWithEmailAndPassword(email, password)
    }

    public check(callback:any = null, path: String = '') {
        
        this.scope((user: any)=> { 
            
            this.Subscribe(callback)

            var state = ( user ) ? true : false
            
            if (!state) { this.redirect(path) }

            this.NotifyAll(state)
        })
    }

    public access(user: any, callback:any = null) {

        this.Subscribe(callback)

        if (null == this.firebase.auth().currentUser) {

            var Login = this.CallSignEmail(user.email, user.password)

            this.response.user = this.firebase.auth().currentUser

            Login
                .then((user: any)=>{
                    
                    this.response.code = "200"
                    this.response.message = "Sessão iniciada com sucesso!"
                    this.response.user = user

                }).catch((error: any)=> {

                    this.response.code = "400"
                    this.response.error = error
                    this.response.user = this.firebase.auth().currentUser 
                    this.response = this.extend(this.response, this.ErrorHandle(error.code))

                }).finally(()=>{
                    this.NotifyAll(this.response)
                })
                
        } else {
            this.response.code = "200"
            this.response.message = "Sessão atualizada com sucesso!"
            this.NotifyAll(this.response)
        }  
    }

    public denied(callback:any = null){
        
        this.Subscribe(callback)

        if (null != this.firebase.auth().currentUser) { 

            this.firebase.auth().signOut()
            this.response.user = null
            this.response.code = "200"
            this.response.message = "Sessão terminada com sucesso!"
        } else {
            this.response.code = "400"
            this.response.message = "Erro ao tentar terminar sessão"
        }
        
        this.NotifyAll(this.response)
    }

    public redirect(path: String) {
        this.Router.navigate([path])
    }

    private ErrorHandle(error: String) {
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