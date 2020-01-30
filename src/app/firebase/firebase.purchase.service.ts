/*
 * firebase.purchase.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'

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
    private collection = "products"

    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(init: FirebaseInitService){
        this.init = init
        this.scope = this.init.scope
        this.firebase = this.init.on()
        this.db = this.init.db()
        this.response = this.init.response()
        this.Subscribe = this.init.Subscribe
        this.NotifyAll = this.init.NotifyAll
        this.copy = this.init.copy
        this.extend = this.init.extend
    }

    private getCollection() {
        return this.db.collection(this.collection)
    }

    public setUid(uid: String) { this.uid = uid }

    public save(product: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        if (that.uid.length > 5) {
            
            product = Object.assign(product, {uid: that.uid})

            that.getCollection().doc().set(product, {merge: true})
                .then(()=>{
                    that.response.code = "200"
                    that.response.message = "Produco cadastrado com sucesso"
                    that.response.product = product
                }).catch((error)=>{
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

    public list(callback: any) {
        var that = this
        
        if (that.uid) {

            that.Subscribe(callback)

            that.getCollection().where("uid", "==", that.uid).get()
                .then((query)=>{  
                    var data = []
                    
                    query.forEach((doc)=> {
                        data.push(that.extend(doc.data(), { id: doc.id}))
                    });

                    that.response.code = "200"
                    that.response.message = "lista Carregada com sucesso"
                    that.response.list = data
                }).catch((error)=>{
                    that.response.code = "400"
                    that.response.message = "Ocorreu algum erro"
                    that.response.error = error
                }).finally(()=> {
                    that.NotifyAll(that.response)
                })
        } else {
            that.response.code = "400"
            that.response.message = "Precisa estar logado apara ver esta página"
            that.NotifyAll(that.response)
        }
    }

}