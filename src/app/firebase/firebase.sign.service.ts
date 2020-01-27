/*
 * firebase.sign.service.ts
 * Autor: Lucas
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from '../firebase/firebase.init.service'

let _Init = new FirebaseInitService

@Injectable({
    providedIn: "root",
})

export class FirebaseSignService {

    private init: FirebaseInitService
    private firebase: any
    private db: any
    private response: any
    private user: any
    
    private observers = []

    public constructor() {
        this.init = _Init
        this.firebase = _Init.on()
        this.db = _Init.db()
        this.response = _Init.response
    }

    private CallSignEmail(email: string, password: string) {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    public create(sign: any, callback: any) {
        
        this.Subscribe(callback)

        var Sign = this.CallSignEmail(sign.email, sign.password)
        Sign
            .then((user)=> {
                this.response.code = "201"
                this.response.message = "Conta Criado com sucesso!"
                this.user = sign
                this.user.uid = user.uid
            }).catch((error)=> {
                this.ErrorHandle(error.code)
            }).finally(()=> {
                this.NotifyAll(this.response)
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
        switch(error) {
            case "auth/invalid-email":
                this.response.code = "400"
                this.response.message = "formatação do Email inválida"
                break
            case "auth/weak-password":
                this.response.code = "400"
                this.response.message = "Senha fraca, favor utilizar mais de 6 caracteres."
                break
            case "auth/email-already-in-use":
                this.response.code = "400"
                this.response.message = "Este email está em uso"
                break
            default:
                break
        }
    }

    private createUserFiretore(user: any) {
        this.db
            .collection("users")
            .doc(user.uid)
            .set(user, {merged: true})
    }
    
}