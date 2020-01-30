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

    public currentEvent = {
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

        this.currentEvent.tickets = Ticket.eventTicket
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public set(event) {
        this.currentEvent = this.Event.extend(this.currentEvent, event)
    }

    public create(callback) {
        this.Event.setUid(this.uid)
        this.Event.set(this.currentEvent, callback)
    }

    public update(callback) {
        this.Event.setUid(this.uid)
        this.create(callback)
    }

    public read(callback) {
        this.Event.setUid(this.uid)
        this.Event.get(callback)
    }
}