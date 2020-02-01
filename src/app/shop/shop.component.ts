import { Component, OnInit, ɵConsole } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { EventService } from './../event/event.service'
import { TicketService } from './../ticket/ticket.service'
import { PurchaseService } from './../purchase/purchase.service'

declare var M: any

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {
    
    private uid: String
    private Login: any
    private Event: any
    private Ticket: any
    private Purchase: any
    
    public user: any
    public event: any
    public ticket: any
    public purchase = []

    public control = {
        modal: {
            purchase: false,
            pay: false,
        },
        method: false,
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

        /*this.user = { 
            name: "Cliente", 
            surname: 'c',
            telephone: '11111111',
            email:"cliente@cliente", 
            bi: "1234123423",
        }*/
    }
    
    public ngOnInit() { 
        var that = this

        that.Login.check(null, 'login')
        
        that.Login.scope((user)=> { 
            if (null !== user) { that.uid = user.uid } 
            this.loadEvent()

            this.Purchase.setUid(this.uid)

        })
    }

    private loadEvent(callback: any = null) {
        this.Event.setUid(this.uid)
        this.Event.Subscribe(callback)

        this.Event.read((response)=> { 
            this.event = this.Event.extend(this.event, response.events[0]) 
            this.Event.NotifyAll(this.event)
        })
    }
    
    public onChange() {
        this.ticket.price = 
            (this.ticket.seat.type == "VIP") 
            ? this.event.tickets.vip.price 
            : this.event.tickets.normal.price
    }
    
    public removeTicket(index: any) {
        this.Purchase.remove(index)
        this.updatePurchase()
    }

    public onDelete(index: any) {
        this.removeTicket(index)
    }

    public updatePurchase() {
        this.purchase = this.Purchase.get()
        this.control.total = this.Purchase.total()
    }

    public addTicket(ticket) {

        console.log("TK", ticket)

        var that = this
        
        if (that.Ticket.validate(ticket).check) {
            
            that.control.modal.purchase = true
            
            ticket.uid = that.uid
            ticket.eid = that.event.id
            ticket.event = that.Ticket.extend(ticket.event, that.event)

            that.Event.getTicketEdition(ticket.seat.type, (edition) => {

                that.control.modal.purchase = false

                ticket.edition = that.Purchase.extend(ticket.edition, edition)
                
                that.Purchase.add(that.Purchase.copy(ticket))
                that.Purchase.notify('Ingresso adicionado')

                that.updatePurchase()

            });
        }
    }

    public finallyPurchase() {
        
       this.Purchase.setUid(this.uid)
       this.Purchase.setUser(this.user)

        if (this.Purchase.valid().check) {
            
            this.control.modal.pay = true;
            
            this.Purchase.transaction((response)=> {

                this.control.modal.pay = false;
                this.notify("Ingressos reservados com sucesso")
                this.Login.redirect("payment")

            })
        }

    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}
