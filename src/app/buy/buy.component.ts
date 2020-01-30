import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { PurchaseService } from './../purchase/purchase.service'
import { TicketComponent } from './../ticket/ticket.component'

@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css']
})

export class BuyComponent implements OnInit {

    private uid: any
    private login: any
    private purchase: any

    public list: any
    public control = {
        bar: false
    }

    public constructor(login: FirebaseLoginService, purchase: PurchaseService) { 
        this.login = login
        this.purchase = purchase
    }

    ngOnInit() {
        var that = this
        that.login.scope((user)=> { if (null !== user) { that.uid = user.uid } })
        that.login.check(null, 'login')
        that.list = []

        that.load()
    }

    public load() {
        var that = this

        that.control.bar = true

        setTimeout(()=> {
            that.purchase.setUid(that.uid)
            that.purchase.getList((response)=> {
                that.control.bar = false
                if ("200" == response.code) {
                    that.list = that.list.concat(response.list)
                }
            })
        }, 1500)
    }

}
