/*
 * firebase.sign.service.ts
 * Autor: Lucas
 * Data: Janeiro de 2020
 */
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { Injectable  } from '@angular/core'

@Injectable({
    providedIn: "root"
})

export class FirebaseSignService {

    private init: any
    private firebase = null
    private db = null
    private response = null
    private user = null
    
    private observers = []

    public constructor(init: FirebaseInitService) {
        this.init = init
        this.firebase = this.init.on()
        this.db = this.init.db()
        this.response = this.init.response
    }

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password)
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

    public Subscribe(command:any) {
        this.observers.push(command)
    }

    public NotifyAll(command: any) {
        this.observers.forEach(ObserverFuncion => {
            ObserverFuncion(command)
        });

        this.observers = []
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