import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from './../firebase/firebase.login.service'
import { PurchaseService } from './../purchase/purchase.service'


@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css']
})

export class BuyComponent implements OnInit {

    private Login: any
    private Purchase: any
    private uid: String

    public purchases: any

    public control = {
        bar: false
    }

    public constructor(Login: FirebaseLoginService, Purchase: PurchaseService) { 
       
        this.Login = Login
        this.Purchase = Purchase

        this.purchases = []
    }

    ngOnInit() {
        var that = this
        
        this.control.bar = true
        that.Login.check(null, 'login')
        
        that.Login.scope((user)=> { 
            if (null !== user) { that.uid = user.uid } 

            this.loadPurchases()
        })

    }

    public loadPurchases() {
    
        this.Purchase.setUid(this.uid)
        
        this.Purchase.acquire((response)=> {
            this.control.bar = false
            this.purchases = response.purchases
            console.log("LOADS",this.purchases)
        })
    }

    

}
