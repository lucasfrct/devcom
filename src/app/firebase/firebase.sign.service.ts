/*
 * firebase.sign.service.ts
 * Autor: Lucas
 * Data: Janeiro de 2020
 */
import { Injectable  } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { FirebaseLoginService } from './../firebase/firebase.login.service'

@Injectable({
    providedIn: "root"
})

export class FirebaseSignService {

    private init: any
    private scope: any
    private firebase: any
    private db: any
    private response: any
    private Subscribe: any
    private NotifyAll: any
    private copy: any
    private extend: any
    private login: any
    private user: any
    
    public constructor(init: FirebaseInitService, login: FirebaseLoginService) {
        this.init = init
        this.scope = this.init.scope
        this.firebase = this.init.on()
        this.db = this.init.db()
        this.response = this.init.response()
        this.Subscribe = this.init.Subscribe
        this.NotifyAll = this.init.NotifyAll
        this.copy = this.init.copy
        this.extend = this.init.extend
        this.login = login
    }

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    public check(callback: any, path: String) {
        this.login.check(callback, path)
    }

    public create(sign: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        var Sign = that.CallSignEmail(sign.email, sign.password)
        Sign
            .then((response)=> {
                console.log("NEW USER: ", response)
                that.user = sign
                that.user.uid = response.user.uid
                that.response.user = that.user
                that.response.code = "201"
                that.response.message = "Conta Criado com sucesso!"
                that.createUserFiretore(that.user)
            }).catch((error)=> {
                that.ErrorHandle(error.code)
            }).finally(()=> {
                that.NotifyAll(that.response)
            })
    }

    private ErrorHandle(error: any) {
        var that = this
        
        switch(error) {
            case "auth/invalid-email":
                that.response.code = "400"
                that.response.message = "Formatação do e-mail inválida, favor inserir um email válido."
                break
            case "auth/weak-password":
                that.response.code = "400"
                that.response.message = "Senha fraca ou insuficiente, favor utilizar mais de 8 caracteres."
                break
            case "auth/email-already-in-use":
                that.response.code = "400"
                that.response.message = "Este email está em uso, favor inserir outro email para cadastro."
                break
            default:
                break
        }
    }

    private createUserFiretore(user: any) {
        this.db.collection("users").doc(user.uid).set(user, {merge: true})
    }
}