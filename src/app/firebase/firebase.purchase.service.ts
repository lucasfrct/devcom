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
    
    private init = null
    private db = null
    private response = null
    public uid: any

    private observers = []

    public constructor(init: FirebaseInitService){
        this.init = init
        this.db = this.init.db()
        this.response = this.init.response
    }

    public save(product: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        if (that.uid) {
            that.db.collection("users").doc(that.uid).set({}, {merge: true})
                .then((prod)=>{
                    console.log("PRODUICT: ", prod)
                }).catch((error)=>{

                }).finally(()=> {
                    that.NotifyAll(that.response)
                })
        } else {
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