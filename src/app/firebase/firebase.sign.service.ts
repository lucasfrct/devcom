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
        
        this.Subscribe(callback)

        var Sign = this.CallSignEmail(sign.email, sign.password)
        Sign
            .then((response)=> {
                console.log("NEW USER: ", response)
                this.user = sign
                this.user.uid = response.user.uid
                this.response.user = this.user
                this.response.code = "201"
                this.response.message = "Conta Criado com sucesso!"
                this.createUserFiretore(this.user)
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

    private createUserFiretore(user: any) {
        this.db.collection("users").doc(user.uid).set(user, {merge: true})
    }
}