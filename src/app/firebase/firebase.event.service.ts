/*
 * firebase.event.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'

@Injectable({
    providedIn: "root"
})

export class FirebaseEventService {

    private uid: any
    private Firebase: any
    private DB: any
    private collection = "events"
    
    public scope: any
    public response: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService) {
        this.scope = Init.scope
        this.Firebase = Init.on()
        this.DB = Init.db()
        this.response = Init.response()
        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    private callCollectionEvent() {
        return this.DB.collection(this.collection)
    }

    public set(event: any, callback: any) {
        
        this.Subscribe(callback)
        
        if(this.uid) {
            
            var collection = null
            event.uid = this.uid


            if (event.id) {
                collection = this.callCollectionEvent().doc(event.id)
            } else {
                collection = this.callCollectionEvent().doc()
            }
            
            collection
                .set(event, {merge: true})
                .then(()=>{
                    this.response.code = "200"
                    this.response.message = "Evento criado com sucesso!"
                    this.response.event = event
                })
                .catch((error)=> {
                    this.response.code = "200"
                    this.response.message = "Aconteceu algum erro."
                    this.response.error = error  
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                })
                
        } else {
            this.response.code = "200"
            this.response.message = "Usuário não logado"
            this.response.event = event
            this.NotifyAll(this.response)
        }
    
        
    }

    public get(callback) {
        var that = this

        that.Subscribe(callback)

        if (that.uid) {
            
            that.callCollectionEvent()
                .get()
                .then((query)=> {
                    var data = []
                    query.forEach((doc)=> {
                        data.push(that.extend(doc.data(), { id: doc.id}))
                    })
                    that.response.code = "200"
                    that.response.message = "Lista Carregada com sucesso!"
                    that.response.events = data
                })
                .catch((error)=> {
                    that.response.code = "400"
                    that.response.message = "Ocorreu algum erro."
                    that.response.error = error
                })
                .finally(()=> {
                    that.NotifyAll(that.response)
                })
                
        } else {
            that.response.code = "400"
            that.response.message = "Usuáruiio não Logado"
            that.NotifyAll(that.response)
        }

    }
}