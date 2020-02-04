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
    public cart = []

    public control = {
        modal: {
            ticket: false,
            purchase: false,
            payment: false,
        },
        ticket: false,
        method: false,
        total: 0,
    }
    
    public constructor(
        Login: FirebaseLoginService, 
        User: UserService,
        Event: EventService, 
        Ticket: TicketService,
        Purchase: PurchaseService,
    ) {
        this.Login = Login
        this.User = User
        this.Event = Event
        this.Ticket = Ticket
        this.Purchase = Purchase

        this.user = User.current
        this.event = Event.current
        this.ticket = Ticket.current //display ticket (layout html)
        this.cart = Purchase.load()

    }
    
    public ngOnInit() { 
        var that = this

        that.Login.check(null, 'login')
        
        that.Login.scope((user)=> { 
            
            if (null !== user) { 
                console.log("Load user")

                this.uid = user.uid

                this.Ticket.setUid(this.uid)

                this.Purchase.setUid(this.uid)

                this.User.setUid(this.uid)
                this.User.load((response)=>{
                    this.user = response.user
                })

                this.Event.setUid(this.uid)
                this.Event.load((response)=>{
                    
                    this.event = response.events[0]

                    this.Ticket.setEid(this.event.eid)
                    this.Ticket.current.event = this.event
                    this.control.ticket = true

                    this.Purchase.setEid(this.event.eid)

                })
            } 

        })
    }

    public onChangeSession(session: String) {
        this.Ticket.current.seat.session = session
        this.ticket.seat.session = session
    }

    public onChangeType(type: String) {
        this.Ticket.current.seat.type = type
        this.ticket.seat.type = type
        
        this.ticket.price = this.Ticket.changePrice()
    }

    public onDelete(index: any) {
        this.Purchase.remove(index)
        this.cart = this.Purchase.load()
        this.control.total = this.Purchase.current.total
    }

    public onMethod(method: any) {
        this.Purchase.current.method = method
        this.control.method = (method) ? true : false 
    }

    public addTicket() {
        
        if (this.Ticket.valid().check) {

            this.control.modal.ticket = true
            
            this.Ticket.current.event = this.Ticket.extend(this.Ticket.current.event, this.Event.current)

            this.Event.getTicketEdition(this.Ticket.current.seat.type, (edition) => {

                this.control.modal.ticket = false

                this.Ticket.current.edition = this.Ticket.extend(this.Ticket.current.edition, edition)
     
                this.Purchase.add(this.Purchase.copy(this.Ticket.current))
                this.cart = this.Purchase.load()
                this.control.total = this.Purchase.current.total
  
            });
    
        } else {
            this.notify("Preencha o ingresso")
        }
    }

    public finallyPurchase() {
        
        this.Purchase.setUid(this.uid)
        this.Purchase.setUser(this.User.current)
    
        if (this.Purchase.valid().check) {
            this.control.modal.payment = true   
        }

    }

    public cancelPayment() {
        this.control.modal.payment = false
    }

    public confirmPayment(){
        this.control.modal.payment = false
        this.register()
    }

    public register() {
        
        this.control.modal.purchase = true;

        this.Purchase.transaction((response)=> {
            this.control.modal.purchase = false;
            this.Purchase.notify("Ingressos reservados com sucesso", 6000)
            this.reset()
        })
    }

    private reset() {
        this.cart = this.Purchase.load()
        this.control.total = this.Purchase.current.total
    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}
