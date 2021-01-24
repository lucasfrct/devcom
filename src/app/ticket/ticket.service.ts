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
    private eid: any
    private pid: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public current: any

    public constructor(Ticket: FirebaseTicketService) {
        
        this.Ticket = Ticket

        this.scope = Ticket.scope
        this.Subscribe = Ticket.Subscribe
        this.NotifyAll = Ticket.NotifyAll
        this.copy = Ticket.copy
        this.extend = Ticket.extend 
        
        this.clean()
    }

    public setUid(uid: String) {
        this.uid = uid
        this.current.uid = uid
    }

    public setEid(eid: String) {
        this.eid = eid
        this.current.eid = eid
    }

    public setPid(pid: String) {
        this.pid = pid
        this.current.pid = pid
    }

    public valid() {
        var valid = { check: false };
        
        if (!uid(this.current.uid)) {
            this.notify('O ingresso não contém um usuário vinculado')
        }

        if (!eid(this.current.eid)) {
            this.notify('O ingresso não contém um evento vinculado')
        }

        if (!name(this.current.owner)) {
            this.notify('Favor digitar um nome com mais de 3 letras')
        }

        if (!price(this.current.price)) {
            this.notify('Não existe um preçco para esse ingresso')
        }
        
        if (!session(this.current.seat.session)) {
            this.notify('Favor Selecionar um assento.')
        }
        
        if (!type(this.current.seat.type)) {
            this.notify('Favor Selecionar um tipo de ingresso.')
        }
        
        valid.check = (
            uid(this.current.uid)
            && eid(this.current.eid)
            && name(this.current.owner) 
            && price(this.current.price)
            && session(this.current.seat.session) 
            && type(this.current.seat.type)
        ) ? true : false;
        
        function uid(uid: String) {
            return (uid && uid.length > 15) ? true : false
        }

        function eid(eid: String) {
            return (eid && eid.length > 15) ? true : false
        }

        function name(name: String) {
            return (name && name.length >= 3) ? true : false;
        }

        function price(price: String) {
            return (price && price.length > 0) ? true : false
        }
        
        function session(session: any) {
            return (session.length >= 3) ? true : false;
        }
       
        function type(type: String) {
            return ("VIP" == type || "Normal" == type) ? true : false;
        }

        return valid;
    }

    public save(callback: Object = null) {
        this.Ticket.setUid(this.uid)
        this.Ticket.set(this.copy(this.current), callback)
    }

    public list(callback: Object = null) {
        this.Ticket.setUid(this.uid)
        this.Ticket.get(callback)
    }

    public obtain(pid: String, callback: Object = null) {
        //console.log("OBTAIN", pid)
        this.Ticket.setUid(this.uid)
        this.Ticket.setPid(pid)
        this.Ticket.gain(callback)
    
    }

    public changePrice() {
        
        this.current.price = (this.current.seat.type == "VIP" )
        ? this.current.event.tickets.vip.price
        : this.current.event.tickets.normal.price
        
        return this.current.price
    }

    public sanitize() {
        this.current.tid = ""
        this.current.owner = ""
        this.current.price = ""
        this.current.seat.session = ""
        this.current.seat.tupe = ""
        this.current.edition.circulation = ""
        this.current.edition.serial = ""
    }

    public clean() {
       this.current = {
            uid: "",
            eid:"",
            pid:"",
            tid: "",
            owner: "",
            price: "0",
            event: {
                eid: "",
                name: "",
                folderUrl: "",
                logoUrl: "",
                date: "",
                hour: "",
                address: "",
                tickets: { 
                    vip: { price: "", total: "", sold: "", approved: "",}, // total - vendidos - aprovados
                    normal: { price: "", total: "", sold: "", approved: "", } 
                },
            },
            seat: { session: "", type: "" },
            edition: { circulation: "", serial: "" },
        }
    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}