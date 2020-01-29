/*
 * firebase.login.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: "root"
})

export class FirebaseLoginService {

    private init: any
    private firebase: any
    private db: any
    private response: any
    private user: any

    private observers = []

    public constructor(init: FirebaseInitService) {
        this.init = init
        this.firebase = this.init.on()
        this.response = this.init.response
    }

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().signInWithEmailAndPassword(email, password)
    }

    public access(user: any, callback) {
        var that = this
        that.Subscribe(callback)

        if (null == that.firebase.auth().currentUser) {
            var Login = that.CallSignEmail(user.email, user.password)
            Login
                .then((user)=>{
                    console.log("---")
                    that.response.user = that.firebase.auth().currentUser
                    that.response.code = "201"
                    that.response.message = "sesão iniciada com sucesso"
                }).catch((error)=>{
                    that.ErrorHandle(error.code)
                }).finally(()=>{
                    that.NotifyAll(that.response)
                })
        } else {
            that.response.user = that.firebase.auth().currentUser
            that.response.code = "200"
            that.response.message = "Sessão atualizada com sucesso"
            that.NotifyAll(that.response)
        }  
    }

    public Subscribe(command: any) {
        this.observers.push(command)
    }

    public NotifyAll(command: any) {
        this.observers.forEach(ObserverFuncion => {
            ObserverFuncion(command)
        })

        this.observers = []
    }

    private ErrorHandle(error: any) {
        switch(error) {
            case "auth/wrong-password":
                this.response.code = "400"
                this.response.message = "A senha está errada."
                break
            case "auth/too-many-requests":
                this.response.code = "400"
                this.response.message = "Muitas tenataivas erradas. Favor tente novamente mais tarde"
                break
            case "auth/user-not-found":
                this.response.code = "400"
                this.response.message = "este email não está registrado"
                break
            default:
                this.response.code = "400"
                this.response.message = "algum erro foi encontrado."
                break
        }
    }

    public denied(callback = ()=>{ }){
        
        this.Subscribe(callback)

        if ( null != this.firebase.auth().currentUser) { 
            this.firebase.auth().signOut()
            this.response.user = null
            this.response.code = "400"
            this.response.message = "Sessão terminada pelo usuário"
        }
        
        this.NotifyAll(this.response)
    }
}