/*
 * firebase.ticket.service
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { FirebaseEventService } from './../firebase/firebase.event.service'
import { tick } from '@angular/core/testing'

@Injectable({
    providedIn: 'root'
})

export class FirebaseTicketService {

    private collection = "tickets"
    private Event: any
    private uid:any 
    private pid: any
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

    public setUid(uid: String) { 
        this.uid = uid 
    }

    public setPid(pid: String) {
        this.pid = pid
    }

    private getCollection() {
        return this.DB.collection(this.collection)
    }

    public set(ticket: any, callback: Object = null) {
        var collection = null

        this.Subscribe(callback)
        
        if (
            this.uid && this.uid.length > 15
            && ticket.eid && ticket.eid.length > 15
            && ticket.pid && ticket.pid.length > 15
        ) {

            if (ticket.tid && ticket.tid.length > 15) {
                collection = this.getCollection().doc(ticket.tid).set(ticket, {merge: true})
            } else {
                collection = collection = this.getCollection().add(ticket)
            }
  
            collection
                .then((doc)=>{

                    this.response.code = "200"
                    this.response.message = "Ingresso cadastrado com sucesso!"

                    if (doc && doc.id.length > 15) {
                        ticket.tid = doc.id
                        this.response.code = "201"
                    }

                    this.response.ticket = ticket

                }).catch((error)=>{
                    this.response.code = "400"
                    this.response.message = "Ocorreu algum erro"
                    this.response.ticket = ticket
                    this.response.error = error
                }).finally(()=> {
                    this.NotifyAll(this.response)
                })

        } else {
            this.response.code = "400"
            this.response.message = "Usuário não registrado, favor logar no painel"
            this.response.ticket = ticket
            this.NotifyAll(this.response)
        }
    }

    public get(callback: Object = null) {


        this.Subscribe(callback)
        
        if (this.uid && this.uid.length > 5) {

            this.getCollection()
                .where("uid", "==", this.uid)
                .get()
                .then((query)=>{  
                    var data = []
                    
                    query.forEach((doc)=> {
                        data.push(this.extend(doc.data(), { id: doc.id}))
                    });

                    this.response.code = "200"
                    this.response.message = "lista Carregada com sucesso"
                    this.response.list = data
                }).catch((error)=>{
                    this.response.code = "400"
                    this.response.message = "Ocorreu algum erro"
                    this.response.error = error
                }).finally(()=> {
                    this.NotifyAll(this.response)
                })
        } else {
            this.response.code = "400"
            this.response.message = "Precisa estar logado apara ver esta página"
            this.NotifyAll(this.response)
        }
    }

    public gain(callback: any) {

        var response = this.copy(this.response)

        if (this.uid && this.uid.length > 15 && this.pid && this.pid.length > 15) {

            this.getCollection()
                .where("uid", "==", this.uid)
                .where("pid", "==", this.pid)
                .get()
                .then((query)=> {
                    
                    var data = []
                    
                    query.forEach((doc)=> {
                        data.push(this.extend(doc.data(), { tid: doc.id }))
                    })

                    response.code = "200"
                    response.message = "Lista de ingressos caregada com sucesso!"
                    response.tickets = data

                })
                .catch((error)=> {

                    response.code = "400"
                    response.message = "Ocoreu algum erro ao carregar os ingressos"
                    response.error = error
                    response.tickets = []

                })
                .finally(()=> {
                    callback(response)
                })

        } else {
            response.code = "400"
            response.message = "Usuário ou identificação de compra inexistentes"
            response.tickets = []
            callback(response)
        }


    }
}