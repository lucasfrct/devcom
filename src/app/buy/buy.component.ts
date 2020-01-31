import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { TicketService } from './../ticket/ticket.service'


@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css']
})

export class BuyComponent implements OnInit {

    private Login: any
    private Ticket: any
    private uid: String

    public list: any

    public control = {
        bar: false
    }

    public constructor(Login: FirebaseLoginService, Ticket: TicketService) { 
        this.Login = Login
        this.Ticket = Ticket

        this.list = []
    }

    ngOnInit() {
        var that = this
        
        that.Login.check(null, 'login')
        
        that.Login.scope((user)=> { 
            if (null !== user) { that.uid = user.uid } 
            that.loadTickets()
        })
        
        that.list = []

    }

    public loadTickets() {
        var that = this

        that.control.bar = true

        that.Ticket.setUid(that.uid)

        that.Ticket.list((response)=> {
            that.control.bar = false
            
            if ("200" == response.code) {
                that.list = that.list.concat(response.list)
            }
        })
    }

}
