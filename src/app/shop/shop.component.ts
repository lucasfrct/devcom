import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { EventService } from './../event/event.service'
import { TicketService } from './../ticket/ticket.service'
import { PurchaseService } from './../purchase/purchase.service'
import { tick } from '@angular/core/testing';

declare var M: any

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {
    
    private uid: any
    private Login: any
    private Event: any
    private Ticket: any
    private Purchase: any
    
    public event: any
    public ticket: any
    public purchase = []

    public control = {
        modal: null,
        modalPurchase: null,
        total: 0,  
    }
    
    public constructor(
        Login: FirebaseLoginService, 
        Event: EventService, 
        Ticket: TicketService,
        Purchase: PurchaseService
    ) {
        this.Login = Login
        this.Event = Event
        this.Ticket = Ticket
        this.Purchase = Purchase

        this.event = Event.currentEvent
        this.ticket = Ticket.currentTicket
    }
    
    ngOnInit() { 
        var that = this
        
        that.Login.scope((user)=> { 
            if (null !== user) { that.uid = user.uid } 
            this.eventLoad()
        })

        that.Login.check(null, 'login')
    }

    private eventLoad(callback: any = null){
        this.Event.setUid(this.uid)
        this.Event.read((response)=> { 
            this.event = this.Login.extend(this.event, response.events[0]) 
            if (callback) {
                callback(this.event)
            }
        })
    }
    
    public onChange() {
        this.ticket.price = 
            (this.ticket.seat.type == "VIP") 
            ? this.event.tickets.vip.price 
            : this.event.tickets.normal.price
    }
    
    public addTicket(ticket) {

        var that = this
        
        if (that.Ticket.validate(ticket).check) {
            
            that.control.modal = true
            
            ticket.uid = that.uid
            ticket.eid = that.event.id

            console.log("ADD RUN", ticket)
            
            that.getTicketEdition(ticket, (edition) => {

                that.control.modal = false
                that.ticket.edition = edition
                
                that.Purchase.add(that.Login.copy(that.ticket))
                that.purchase = that.Purchase.get()
                that.control.total = that.Purchase.total()

                M.toast({ html: 'Ingresso adicionado' })

            });
        }
    }

    public removeTicket(index: any) {
        this.Purchase.remove(index)
        this.purchase = this.Purchase.get()
        this.control.total = this.Purchase.total()
    }

    public onDelete(index: any) {
        this.removeTicket(index)
    }
   
    private getTicketEdition(ticket: any, callback: any) {

        this.eventLoad((event)=> {

            var normal = event.tickets.normal
            var vip = event.tickets.vip
            var edition = { circulation: "", serial: "" }

            if(ticket.seat.type =="Normal") {
                edition.circulation = "A01"
                edition.serial = serial(normal.sold)
            }

            if(ticket.seat.type =="VIP" ) {
                edition.circulation = "V01"
                edition.serial = serial(vip.sold)
            }

            callback(edition)
        })

        function serial(str) {
            return String(Math.floor(Math.random() * 100) + String((Number(str) + 1)))
        }
    }

    public finallyPurchase(purchase) {

        if (this.validPurchase(purchase, this.uid)) {
            
            this.control.modalPurchase = true;
            
            this.Purchase.setUid(this.uid)
            
            this.Purchase.setCart(purchase)
            
            this.Purchase.makeTransaction((response)=> {
                this.control.modalPurchase = false;
                this.notify("Ingressos reservados com sucesso")
                this.Login.redirect("payment")
            })
        }
        
    }
    
    private validPurchase(purchase: any, uid: any) {

        if (!purchaseValid(purchase)) {
            this.notify("Não há ingresso no carrinho.")
        }

        if (!uidValid(uid)) {
            this.notify("Você precisa logar para finalizar  a compra")
        }

        return (purchaseValid(purchase) && uidValid(uid)) ? true : false

        function purchaseValid(purchase: any) {
            return (purchase.length > 0 && typeof purchase == "object") ? true : false
        }

        function uidValid(uid: String) {
            return (uid.length > 0 && typeof uid == "string") ? true : false
        }
    }
    
    private copy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}
