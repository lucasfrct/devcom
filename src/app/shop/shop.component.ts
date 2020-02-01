import { Component, OnInit, ɵConsole } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { UserService } from './../user/user.service'
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
    private User: any
    private Event: any
    private Ticket: any
    private Purchase: any
    
    public user: any
    public event: any
    public ticket: any
    public purchase = []

    public control = {
        modal: {
            ticket: false,
            purchase: false, 
        },
        method: false,
        total: 0,  
    }
    
    public constructor(
        Login: FirebaseLoginService, 
        User: UserService,
        Event: EventService, 
        Ticket: TicketService,
        Purchase: PurchaseService
    ) {
        this.Login = Login
        this.User = User
        this.Event = Event
        this.Ticket = Ticket
        this.Purchase = Purchase

        this.user = User.current
        this.event = Event.current
        this.ticket = Ticket.current

    }
    
    public ngOnInit() { 
        var that = this

        that.Login.check(null, 'login')
        
        that.Login.scope((user)=> { 
            if (null !== user) { that.uid = user.uid } 

            this.loadUser()
            this.loadEvent()

            this.Purchase.setUid(this.uid)
        })
    }

    private loadUser() {
        this.User.setUid(this.uid)
        this.User.load((response)=> {
            this.user = this.User.extend(this.user, response.user)
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
        this.purchase = this.Purchase.load()
        this.control.total = this.Purchase.current.total
    }

    public addTicket(ticket) {

        var that = this
        
        if (that.Ticket.valid(ticket).check) {
            
            that.control.modal.ticket = true
            
            ticket.uid = that.uid
            ticket.eid = that.event.id
            ticket.event = that.Ticket.extend(ticket.event, that.event)

            that.Event.getTicketEdition(ticket.seat.type, (edition) => {

                that.control.modal.ticket = false

                ticket.edition = that.Purchase.extend(ticket.edition, edition)
                
                that.Purchase.add(that.Purchase.copy(ticket))
                that.Purchase.notify('Ingresso adicionado')

                that.updatePurchase()

            });
        } else {
            that.notify("Preencha o ingresso")
        }
    }

    public finallyPurchase() {
        
       this.Purchase.setUid(this.uid)
       this.Purchase.setUser(this.user)

        if (this.Purchase.valid().check) {
            
            this.control.modal.purchase = true;
            
            //====Escolher forma de pagamento=====================================


            this.Purchase.transaction((response)=> {

                this.control.modal.purchase = false;
                this.notify("Ingressos reservados com sucesso", 6000)
                //this.Login.redirect("payment")

            })
        }

    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}
