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

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    public check(callback: any, path: String) {
        this.Login.check(callback, path)
    }

    public create(sign: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        var Sign = that.CallSignEmail(sign.email, sign.password)
        Sign
            .then((response)=> {

                sign.uid = response.user.uid
                that.response.user = sign
                that.response.code = "201"
                that.response.message = "Conta Criado com sucesso!"
                
                that.User.setUid(sign.uid)
                that.User.set(sign)

            }).catch((error)=> {
                that.response.error = error
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

}