/*
 * purchase.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { TicketService } from './../ticket/ticket.service'

declare var M: any

@Injectable({
    providedIn: "root"
})

export class PurchaseService {

    private Ticket: any
    private uid: String
    private cart = []
    private responses = []
    
    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public extend: any
    public copy: any

    private purchase = {
        uid:"",
        pid: "",
        total: "",
        method: "",
        profile: {
            name: "",
            bi: "",
            telephone:""
        }
    }

    public constructor(Ticket: TicketService) {
        this.Ticket = Ticket

        this.scope= Ticket.scope
        this.Subscribe = Ticket.Subscribe
        this.NotifyAll = Ticket.NotifyAll 
        this.extend = Ticket.extend
        this.copy = Ticket.copy

        this.cart = []
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public add(purchase: any) {
        this.cart.push(purchase)
    }

    public remove(index) {
        this.cart.splice(index, 1)
    }

    get() {
        return this.cart
    }

    public total() {
        var result = 0;
        this.cart.forEach((ticket) => {
            if (ticket.price) { result = Number(result + Number(ticket.price)) }
        })
        return String(result)
    }
   
    public valid() {

        var valid = { check: false }

        if (!purchase(this.cart)) {
            this.notify("Não há ingresso no carrinho.")
        }

        if (!uidValid(this.uid)) {
            this.notify("Você precisa logar para finalizar  a compra")
        }

        valid.check = (purchase(this.cart) && uidValid(this.uid)) ? true : false


        return valid

        function purchase(cart: any) {
            return (cart.length > 0 ) ? true : false
        }

        function uidValid(uid: String) {
            return (uid.length > 0) ? true : false
        }
    }

    public transaction(callback: any) {
        
        var that = this
        
        that.Ticket.setUid(this.uid)

        that.cart.forEach((ticket)=> {

            that.Ticket.save(ticket, (response)=>{

                that.responses.push(response)
                that.notify("Ingresso de "+ticket.owner+" salvo!")
                
                if (that.responses.length == that.cart.length) {
                    callback(that.responses)
                }
            })

        })
    }

    public getList(callback: any) {
        this.Ticket.setUid(this.uid)
        this.Ticket.list(callback)
    }

    public notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}