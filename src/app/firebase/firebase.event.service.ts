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

    private collection = "events"
    private uid: any
    private firebase: any
    private DB: any
    private response: any
    
    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any


    public constructor(Init: FirebaseInitService) {
        
        this.DB = Init.db()
        this.response = Init.response()
        this.firebase = Init.on()
        
        this.scope = Init.scope
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

    public set(event: any, callback: Object = null) {
        
        this.Subscribe(callback)
        
        if(this.uid && this.Subscribe.length > 15) {
            
            var collection = null
            event.uid = this.uid

            if (event.eid) {
                collection = this.callCollectionEvent().doc(event.eid).set(event, {merge: true})
            } else {
                collection = this.callCollectionEvent().add(event)
            }
            
            collection
                .then((doc)=> {

                    this.response.code = "200"
                    this.response.message = "Evento criado com sucesso!"

                    if (doc && doc.id.length > 15) {
                        event.eid = doc.id
                        this.response.code = "201"
                    }
                    
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

    public get(eid: any = null, callback: Object = null) {
        var collection = null

        this.Subscribe(callback)

        if (this.uid && this.uid.length > 15) {
            
        //==================== PARA FORCA APENA O EVENTO CORRRENTE ======================
                                eid = "eEPBQVAwu7yG9dRcW0C9"
        // ==============================================================================
            
            if (eid && eid.length > 15) {
                collection = this.callCollectionEvent().where("eid", "==", eid)
            } else {
                collection = this.callCollectionEvent()
            }

            collection
                .get()
                .then((query)=> {

                    var data = []

                    query.forEach((doc)=> {
                        data.push(this.extend(doc.data(), { eid: doc.id}))
                    })

                    this.response.code = "200"
                    this.response.message = "Lista Carregada com sucesso!"
                    this.response.events = data
                })
                .catch((error)=> {
                    this.response.code = "400"
                    this.response.message = "Ocorreu algum erro na lista de Eventos."
                    this.response.error = error
                    this.response.events = []
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                })
                
        } else {
            this.response.code = "400"
            this.response.message = "Sem ID de Usuário"
            this.response.events = []
            this.NotifyAll(this.response)
        }

    }
}