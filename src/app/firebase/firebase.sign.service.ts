/*
 * firebase.sign.service.ts
 * Autor: Lucas
 * Data: Janeiro de 2020
 */
import { Injectable  } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { FirebaseUserService } from './../firebase/firebase.user.service'

@Injectable({
    providedIn: "root"
})

export class FirebaseSignService {

    private Login: any
    private User: any
    private firebase: any
    private response: any

    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any
    
    public constructor(Init: FirebaseInitService, Login: FirebaseLoginService, User: FirebaseUserService) {
        
        this.Login = Login
        this.User = User

        this.firebase = Init.on()
        this.response = Init.response()

        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend

    }

    private CallSignEmail(email: String, password: String) {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    public check(callback: any, path: String) {
        this.Login.check(callback, path)
    }

    public create(sign: any, callback: Object = null) {

        this.Subscribe(callback)

        var Sign = this.CallSignEmail(sign.email, sign.password)
        Sign
            .then((response)=> {
                console.log("Create User ID", response)

                sign.uid = response.user.uid
               
                this.User.setUid(sign.uid)

                this.User.set(sign, (user)=> {
                    console.log("CREATE USER DB", user)

                    this.response.user = user
                    this.response.code = "201"
                    this.response.message = "Conta Criada com sucesso!"

                    this.NotifyAll(this.response)
                    
                })

            }).catch((error)=> {

                console.log ("ERROR", error)

                this.response.user = sign
                this.response.code = "400"
                this.response.message = "Erroao Cria a conta"
                this.response.error = error
                this.ErrorHandle(error.code)
                
                this.NotifyAll(this.response)

            })
    }

    private ErrorHandle(error: String) {
        
        switch(error) {
            case "auth/invalid-email":
                this.response.code = "400"
                this.response.message = "Formatação do e-mail inválida, favor inserir um email válido."
                break
            case "auth/weak-password":
                this.response.code = "400"
                this.response.message = "Senha fraca ou insuficiente, favor utilizar mais de 8 caracteres."
                break
            case "auth/email-already-in-use":
                this.response.code = "400"
                this.response.message = "Este email está em uso, favor inserir outro email para cadastro."
                break
            default:
                break
        }
    }

    public redirect(path: String) {
        this.Login.redirect(path)
    }

}