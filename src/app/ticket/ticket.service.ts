/*
 * ticket.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseTicketService } from './../firebase/firebase.ticket.service'

declare var M: any

@Injectable({
    providedIn: "root"
})

export class TicketService {

    private Ticket: any
    private uid: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public currentTicket = {
        uid: "",
        eid:"",
        pid:"",
        id: "",
        owner: "",
        seat: { session: "", type: "" },
        edition: { },
        price: "0",
    }

    public edition = { circulation: "", serial: "" }

    public eventTicket = { 
        vip: { price: "", total: "", sold: "", approved: "",}, // total - vendidos - aprovados
        normal: { price: "", total: "", sold: "", approved: "", } 
    }

    public constructor(Ticket: FirebaseTicketService) {
        this.Ticket = Ticket

        this.scope = Ticket.scope
        this.Subscribe = Ticket.Subscribe
        this.NotifyAll = Ticket.NotifyAll
        this.copy = Ticket.copy
        this.extend = Ticket.extend 

        this.currentTicket.edition = this.edition
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public validate(ticket: any) {
        var valid = { check: false };
        
        if (!name(ticket.owner)) {
            this.notify('Favor digitar um nome com mais de 3 letras')
        }
        
        if (!seatSession(ticket.seat.session)) {
            this.notify('Favor Selecionar um assento.')
        }
        
        if (!seatType(ticket.seat.type)) {
            this.notify('Favor Selecionar um tipo de ingresso.')
        }
        
        valid.check = (
            name(ticket.owner) 
            && seatSession(ticket.seat.session) 
            && seatType(ticket.seat.type)
        ) ? true : false;
        
        return valid;
        
        function name(name: String) {
            return (name.length >= 3) ? true : false;
        }
        
        function seatSession(session: any) {
            return (session.length >= 3) ? true : false;
        }
       
        function seatType(type: any) {
            return ("VIP" == type || "Normal" == type) ? true : false;
        }
    }

    public save(ticket, callback) {
        this.Ticket.setUid(this.uid)
        this.Ticket.create(ticket, callback)
    }

    public list(callback: any) {
        this.Ticket.setUid(this.uid)
        this.Ticket.get(callback)
    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}