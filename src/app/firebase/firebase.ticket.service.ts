/*
 * firebase.ticket.service
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { FirebaseEventService } from './../firebase/firebase.event.service'

@Injectable({
    providedIn: 'root'
})

export class FirebaseTicketService {

    private collection = "tickets"
    private Event: any
    private uid:any 
    private DB: any
    private response: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService, Event: FirebaseEventService) {

        this.Event = Event
        
        this.DB = Init.db()
        this.response = Init.response()
        
        this.scope = Init.scope
        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend 
    }

    public setUid(uid: String) { this.uid = uid }

    private getCollection() {
        return this.DB.collection(this.collection)
    }

    public create(ticket: any, callback: any) {
        var that = this
        that.Subscribe(callback)

        if (that.uid.length > 5 && ticket.eid.length > 5) {
            
            ticket = that.extend(ticket, {uid: that.uid})

            that.getCollection().doc().set(ticket, {merge: true})
                .then(()=>{
                    that.response.code = "200"
                    that.response.message = "Produco cadastrado com sucesso"
                    that.response.ticket = ticket
                }).catch((error)=>{
                    that.response.code = "400"
                    that.response.message = "Ocorreu algum erro"
                    that.response.ticket = ticket
                    that.response.error = error
                }).finally(()=> {
                    that.NotifyAll(that.response)
                })
        } else {
            that.response.code = "400"
            that.response.message = "Usuário não registrado, favor logar no painel"
            that.response.ticket = ticket
            that.NotifyAll(that.response)
        }
    }

    public get(callback: Object) {
        var that = this

        that.Subscribe(callback)
        
        if (that.uid && that.uid.length > 5) {

            that.getCollection()
                .where("uid", "==", that.uid)
                .get()
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