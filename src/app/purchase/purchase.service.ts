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
    private cart: any
    private responses: any
    
    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public extend: any
    public copy: any

    private current = {
        uid: "",
        pid: "",
        eid: "",
        name: "",
        telephone: "",
        bi: "",
        method: "",
        total: "",
    }

    public constructor(
        Purchase: FirebasePurchaseService, 
        Ticket: TicketService
    ) {
        this.Purchase = Purchase
        this.Ticket = Ticket

        this.scope= Purchase.scope
        this.Subscribe = Purchase.Subscribe
        this.NotifyAll = Purchase.NotifyAll 
        this.extend = Purchase.extend
        this.copy = Purchase.copy

        this.cart = []
        this.responses = []
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public setUser(user: any = null) {
        this.current.uid = String(this.uid)
        this.current.name = user.name
        this.current.telephone = user.telephone
        this.current.bi = user.bi
        this.current.total = this.total()
    }

    public add(purchase: any) {
        this.cart.push(purchase)
        this.total()
    }

    public remove(index) {
        this.cart.splice(index, 1)
        this.total()
    }

    load() {
        this.total()
        return this.cart
    }

    public total() {
        var result = 0;
        this.cart.forEach((ticket) => {
            if (ticket.price) { result = Number(result + Number(ticket.price)) }
        })

       return this.current.total = String(result)
    }
   
    public valid() {

        var valid = { check: false }

        if (!cart(this.cart)) {
            this.notify("Não há ingresso no carrinho.")
        }

        if (!uid(this.uid)) {
            this.notify("Você precisa logar para finalizar  a compra")
        }

        if(!pid(this.current.pid)) {
            this.notify("Não há registro para essa compra")
        }

        if(!eid(this.current.eid)) {
            this.notify("Não há evento selecionado")
        }

        if(!name(this.current.name)) {
            this.notify("Não há nome de usuário para essa compra")
        }

        if(!telephone(this.current.telephone)) {
            this.notify("Não consta telefone do usuário")
        }

        if(!bi(this.current.bi)) {
            this.notify("Não há um bilhete de identificacao registrado")
        }

        if(!method(this.current.method)) {
            this.notify("Não há método de pagamento selecionado")
        }

        if(!total(this.current.total)) {
            this.notify("Não há valor total Calculado")
        }

        valid.check = (
            cart(this.cart) 
            && uid(this.uid)
            && pid(this.current.pid)
            && eid(this.current.eid)
            && name(this.current.name)
            && telephone(this.current.telephone)
            && bi(this.current.bi)
            && method(this.current.method)
            && total(this.current.total)
        ) ? true : false

        function cart(cart: any = []) {
            return (cart.length > 0 ) ? true : false
        }

        function uid(uid: String = "") {
            return (uid.length > 5) ? true : false
        }

        function pid(pid: String) {
            return (pid && pid.length > 5) ? true : false
        }

        function eid(eid: String) {
            return (eid && eid.length > 5) ? true : false
        }

        function name(name: String) {
            return (name && name.length > 0) ? true : false
        }

        function telephone(telephone: String) {
            return (telephone && telephone.length >= 9) ? true : false
        }

        function bi(bi: String) {
            return (bi && bi.length >= 9) ? true : false
        }

        function method(method: String) {
            return (method && (method == "paypal" || method == "transferencia")) ? true : false
        }

        function total(total: String) {
            return (total && total.length > 0) ? true : false
        }

        return valid
    }

    public transaction(callback: Object = null) {

        var that = this
        var response = { code: "", message: "", purchase: {} }
        
        that.Subscribe(callback)

        that.total()

        if (that.valid().check) {

            that.Purchase.setUid(that.uid)

            that.Purchase.register(that.current, (resp)=> {

                if (resp.code != "400" && resp.purchase.pid && resp.purchase.pid.length > 5) {
           
                    that.Ticket.setUid(this.uid)
    
                    that.cart.forEach((ticket)=> {
    
                        ticket.pid = resp.purchase.pid
    
                        that.Ticket.save(ticket, (res)=>{
    
                            res.ticket = ticket
                            that.responses.push(res)
                            that.notify("Ingresso de "+ticket.owner+" foi salvo!")
                            
                            if (that.responses.length == that.cart.length) {
                                that.NotifyAll(that.responses)
                            }
                        })
    
                    })
    
                } else {
                    response.code = "400"
                    response.message = "Compora não pode ser registrada por algum erro"
                    response.purchase = that.current
                    that.responses.push(response)
                    that.NotifyAll(that.responses)
                }
    
            })

        } else {
            response.code = "400"
            response.message = "Essa transaçcão não foi validada, favor reinicar a compra"
            response.purchase = that.current
            that.responses.push(response)
            that.NotifyAll(that.responses)
        }

        
        
        
    }


    public getList(callback: any) {
        this.Ticket.setUid(this.uid)
        this.Ticket.list(callback)
    }

    public notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}