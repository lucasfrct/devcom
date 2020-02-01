/*
 * purchase.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebasePurchaseService } from './../firebase/firebase.purchase.service'
import { TicketService } from './../ticket/ticket.service'

declare var M: any

@Injectable({
    providedIn: "root"
})

export class PurchaseService {

    private Purchase: any
    private Ticket: any
    private uid: String
    private user: any
    private cart = []
    private responses = []
    
    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public extend: any
    public copy: any

    private purchase = {
        uid: "",
        pid: "",
        name: "",
        telephone: "",
        bi: "",
        method: "",
        total: "",
    }

    public constructor(Purchase: FirebasePurchaseService, Ticket: TicketService) {
        this.Purchase = Purchase
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

    public setUser(user: Object = null) {
        this.user = user
    }

    load() {
        this.purchase.name = this.user.name
        this.purchase.telephone = this.user.telephone
        this.purchase.bi = this.user.bi
        this.purchase.total = this.total()
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
        var response = { code: "", message: "" }
        that.Subscribe(callback)

        that.load()
        that.Purchase.setUid(that.uid)
        
        that.Purchase.register(that.purchase, (resp)=> {

            if (resp.code != "400" && resp.purchase.pid && resp.purchase.pid.length > 5) {
       
                that.Ticket.setUid(this.uid)

                that.cart.forEach((ticket)=> {

                    ticket.pid = resp.purchase.pid

                    that.Ticket.save(ticket, (res)=>{

                        res.ticket = ticket
                        that.responses.push(res)
                        that.notify("Ingresso de "+ticket.owner+" salvo!")
                        
                        if (that.responses.length == that.cart.length) {
                            that.NotifyAll(that.responses)
                        }
                    })

                })

            } else {
                response.code = "400"
                response.message = "Compora não pode ser registrada"
                that.responses.push(response)
                that.NotifyAll(that.responses)
            }

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