/*
 * ticket.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'

declare var M: any

@Injectable({
    providedIn: "root"
})

export class TicketService {

    public currentTicket = {
        uid: "",
        eid:"",
        id: "",
        owner: "",
        seat: { session: "", type: "" },
        edition: { circulation: "", serial: "" },
        price: "0",
    }

    public eventTicket = { 
        vip: { price: "", total: "", sold: "", approved: "",}, // total - vendidos - aprovados
        normal: { price: "", total: "", sold: "", approved: "", } 
    }

    public constructor() {
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

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}