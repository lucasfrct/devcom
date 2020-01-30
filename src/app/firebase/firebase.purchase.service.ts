/*
 * firebase.purchase.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: "root"
})

export class FirebasePurchaseService {
    
    public uid: any
    private init: any
    private scope: any
    private firebase: any
    private db: any
    private response: any
    private observers = []

    public constructor(init: FirebaseInitService){
        this.init = init
        this.scope = this.init.scope
        this.firebase = this.init.on()
        this.db = this.init.db()
        this.response = this.init.response()
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public save(product: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        if (that.uid.length > 5) {
            
            product = Object.assign(product, {uid: that.uid})

            that.db.collection("products").doc().set(product, {merge: true})
                .then(()=>{
                    that.response.code = "200"
                    that.response.message = "Produco cadastrado com sucesso"
                    that.response.product = product
                }).catch((error)=>{
                    console.log("ERROR: ", error)
                    that.response.code = "400"
                    that.response.message = "Ocorreu algum erro"
                    that.response.error = error
                }).finally(()=> {
                    that.NotifyAll(that.response)
                })
        } else {
            that.response.code = "400"
            that.response.message = "Usuário não registrado, favor logar no painel"
            that.NotifyAll(that.response)
        }
    }

    private Subscribe(command: any) {
        this.observers.push(command)
    }

    private NotifyAll(command) {
        this.observers.forEach((ObserverFunction)=> {
            ObserverFunction(command)
        })

        this.observers = []
    }
}