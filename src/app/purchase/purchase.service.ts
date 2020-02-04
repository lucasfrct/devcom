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
        status: "pendente", // pendente aprovado e cancelado
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

    public setUid(uid: any) {
        this.uid = uid
        this.current.uid = uid
    }

    public setEid(eid: any) {
        this.current.eid = eid
    }

    public setUser(user: any = null) {
        this.current.uid = String(this.uid)
        this.current.name = user.name
        this.current.telephone = user.telephone
        this.current.bi = user.bi
        this.current.total = this.total()
    }

    public setMethod(method: any) {
        this.current.method = method
    }

    public add(purchase: any) {
        this.cart.push(purchase)
        this.total()
    }

    public remove(index) {
        this.cart.splice(index, 1)
        this.total()
    }

    public load() {
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

        if(!total(this.current.total)) {
            this.notify("Não há valor total Calculado")
        }

        valid.check = (
            cart(this.cart) 
            && uid(this.uid)
            && eid(this.current.eid)
            && name(this.current.name)
            && telephone(this.current.telephone)
            && bi(this.current.bi)
            && total(this.current.total)
        ) ? true : false

        function cart(cart: any = []) {
            return (cart.length > 0 ) ? true : false
        }

        function uid(uid: String = "") {
            return (uid.length > 5) ? true : false
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

        function total(total: String) {
            return (total && total.length > 0) ? true : false
        }

        return valid
    }

    public transaction(callback: Object = null) {

        var response = { code: "", message: "", purchase: {} }
        
        this.Subscribe(callback)

        this.total()
        
        if (this.valid().check) {
            
            this.Purchase.setUid(this.uid)

            this.Purchase.set(this.current, (resp)=> {

                if (resp.code != "400" && resp.purchase.pid && resp.purchase.pid.length > 15) {

                    this.Ticket.setUid(resp.purchase.uid)
                    
                    this.cart.forEach((ticket)=> {

                        ticket.pid = resp.purchase.pid
                        ticket.eid = resp.purchase.eid
                        
                        this.Ticket.current = this.Ticket.extend(this.Ticket.current, ticket)

                        this.Ticket.save((res)=>{
                            
                            this.responses.push(res)
                            this.notify("Ingresso de "+ticket.owner+" foi salvo!")
                            
                            if (this.responses.length == this.cart.length) {
                                this.reset()
                                this.NotifyAll(this.responses)
                            }
                        })
    
                    })
    
                } else {
                    response.code = "400"
                    response.message = "Compora não pode ser registrada por algum erro"
                    response.purchase = this.current
                    this.responses.push(response)
                    this.NotifyAll(this.responses)
                }
    
            })

        } else {
            response.code = "400"
            response.message = "Essa transaçcão não foi validada, favor reinicar a compra"
            response.purchase = this.current
            this.responses.push(response)
            this.NotifyAll(this.responses)
        }
        
    }

    public getList(callback: any) {
        this.Ticket.setUid(this.uid)
        this.Ticket.list(callback)
    }

    private reset() {
        this.current.pid = ""
        this.current.method = ""
        this.current.total = "0"
        this.cart = []
        this.total()
    }

    public acquire(callback: Object = null) {
        var response = { code: "", message: "", purchases: []}

        this.Subscribe(callback)

        this.Purchase.setUid(this.uid)
        
        this.Purchase.get((resp)=> {

            resp.purchases.forEach((purchase)=> {

                this.Ticket.setUid(this.uid)
                this.Ticket.setPid(purchase.pid)

                this.Ticket.obtain((res)=> {

                    purchase.tickets = res.tickets
                    response.purchases.push(purchase)

                    if (response.purchases.length >= resp.purchases.length) {
                        this.NotifyAll(response)
                    }

                })

            })
            
        })

    }

    public notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}