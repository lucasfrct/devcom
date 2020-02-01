/*
 * event.service.ts
 * Autor Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseEventService } from './../firebase/firebase.event.service'
import { TicketService } from './../ticket/ticket.service'

@Injectable({
    providedIn: "root"
})

export class EventService {

    private Event: any
    private Ticket: any
    private uid: any
    private id: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public current = {
        uid: "",
        id: "",
        name: "",
        folderUrl: "",
        logUrl: "",
        date: "",
        hour: "",
        address: "",
        tickets: {},
    }
    
    public constructor(Event: FirebaseEventService, Ticket: TicketService) {
        this.Event = Event
        this.Ticket = Ticket

        this.scope = Event.scope
        this.Subscribe = Event.Subscribe
        this.NotifyAll = Event.NotifyAll
        this.copy = Event.copy
        this.extend = Event.extend

        this.current.tickets = Ticket.event
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public set(event) {
        this.current = this.Event.extend(this.current, event)
    }

    public create(callback) {
        this.Event.setUid(this.uid)
        this.Event.set(this.current, callback)
    }

    public update(callback) {
        this.Event.setUid(this.uid)
        this.create(callback)
    }

    public read(callback) {
        this.Event.setUid(this.uid)
        this.Event.get(null, callback)
    }

    public getTicketEdition(type: any, callback: any) {

        this.Event.get(null, (response)=> {
            var event = response.events[0]
            var edition = this.Ticket.edition

            if(type =="Normal") {
                edition.circulation = "A001"
                edition.serial = serial(event.tickets.normal.sold)
            }

            if(type =="VIP" ) {
                edition.circulation = "V001"
                edition.serial = serial(event.tickets.vip.sold)
            }

            callback(edition)
        })

        function serial(str) {
            return String(String((Number(str) + 1)) +"-"+ Math.floor(Math.random() * 100))
        }
    }
}