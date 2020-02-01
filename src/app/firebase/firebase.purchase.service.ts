/*
 * firebase.purchase.service.ts
 * Autor Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'

@Injectable({
    providedIn: "root"
})

export class FirebasePurchaseService {

    private collection = "purchases"
    private uid: String
    private response: any
    private Collection: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService) {

        this.scope = Init.scope
        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend
        this.response = Init.response()
        this.Collection = Init.collection(this.collection)
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public register(purchase: any = null, callback: Object = null) {
        var collection = null

        this.Subscribe(callback)

        if (this.uid && this.uid.length > 5) {
            purchase.uid = this.uid

            if (purchase.pid && purchase.pid.length > 5) {
                collection = this.Collection.doc(purchase.pid).set(purchase, {merge: true})
            } else {
                collection = this.Collection.add(purchase)
            }

            collection 
                .then((doc)=> {

                    this.response.code = "200"
                    this.response.message = "Compra resgistrada com sucesso!"

                    if (doc && doc.id) {
                        purchase.pid = doc.id
                        this.response.code = "201"
                    }

                    this.response.purchase = purchase

                })
                .catch((error)=> {
                    this.response.code = "400"
                    this.response.message = "Ocorreu algum erro na compara!"
                    this.response.purchase = purchase
                    this.response.error = error
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                })

        } else {
            this.response.code = "400"
            this.response.message = "O usuário precisa estar logado para comprar"
            this.response.purchase = purchase
            this.NotifyAll(this.response)
        }
    }

}