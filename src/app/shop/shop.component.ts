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
    private eid: String
    
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

        this.user = this.User.current
        this.event = this.Event.current
        this.ticket = this.Ticket.current
    }
    
    public ngOnInit() { 

        this.Login.check(null, 'login')
        
        this.Login.scope((user)=> { 
            
            if (null !== user) { 

                this.uid = user.uid
                
                this.User.setUid(this.uid)
                
                this.User.load((response)=>{
                    
                    this.User.current = this.User.extend(this.User.current, response.user)
                    this.user = this.User.current

                    this.Purchase.setUid(this.User.current.uid)
                    this.Purchase.setUser(this.User.current)    
                    
                })
                
                this.Event.setUid(this.User.current.uid)
                
                this.Event.load((response)=>{

                    this.Event.current = this.Event.extend(this.Event.current, response.events[0])
                    this.event = this.Event.current
                            
                    this.eid = this.Event.current.eid

                    this.Purchase.setEid(this.Event.current.eid)

                    this.Ticket.setUid(this.User.current.uid)
                    this.Ticket.setEid(this.Event.current.eid)
                    this.Ticket.current.event = this.Ticket.extend(this.Ticket.current.event, this.Event.current)
                    this.ticket = this.Ticket.current

                    this.control.ticket = true

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

    public onMethod(method: String) {
        this.Purchase.current.method = method
        this.control.method = (method) ? true : false 
    }

    public addTicket() {

        this.Ticket.setUid(this.User.current.uid)
        this.Ticket.setEid(this.Event.current.eid)
        this.Ticket.current.event = this.Ticket.extend(this.Ticket.current.event, this.Event.current)
        
        if (this.Ticket.valid().check) {
            
            
            this.control.modal.ticket = true
            
            this.Event.setUid(this.User.current.uid)
            this.Event.setEid(this.Event.current.eid)
            this.Event.getTicketEdition(this.Ticket.current.seat.type, (edition) => {
                
                this.control.modal.ticket = false
                
                this.Ticket.current.edition = this.Ticket.extend(this.Ticket.current.edition, edition)
                
                this.Purchase.setUid(this.User.current.uid)
                this.Purchase.setEid(this.Event.current.eid)
                this.Purchase.setUser(this.User.current)
                
                this.Purchase.add(this.Purchase.copy(this.Ticket.current))
                this.cart = this.Purchase.load()
                this.control.total = this.Purchase.current.total
  
            })
    
        } else {
            this.notify("Preencha o ingresso")
        }
    }

    public finallyPurchase() {
        
        this.Purchase.setUid(this.User.current.uid)
        this.Purchase.setEid(this.Event.current.eid)
        this.Purchase.setUser(this.User.current)
    
        if (this.Purchase.valid().check) {
            this.control.modal.payment = true   
        } else {
            this.control.modal.payment = false 
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

        this.control.modal.payment = false
        this.control.modal.purchase = true;

        this.Purchase.setUid(this.User.current.uid)
        this.Purchase.setEid(this.Event.current.eid)
        this.Purchase.setUser(this.User.current)

        this.Purchase.transaction((response)=> {
            this.control.modal.purchase = false;
            this.Purchase.notify("Ingressos reservados com sucesso", 6000)

        })
    }

    private clean() {
        
        //this.Purchase.clean()
        //this.Ticket.clean()


        //this.user = this.User.current
        //this.event = this.Event.current
        //this.ticket = this.Ticket.current //display ticket (layout html)
        //this.cart = this.Purchase.load()
        //this.control.total = this.Purchase.current.total

    }

    private notify(message: String, time = 4000) {
        M.toast({ html: message, displayLength: time });
    }
}
