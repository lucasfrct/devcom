/*
 * purchase.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { FirebasePurchaseService } from './../firebase/firebase.purchase.service'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: "root"
})

export class PurchaseService {

    private uid: String
    private Purchase: any
    public cart = []
    public responses = []

    public constructor(Purchase: FirebasePurchaseService) {
        this.Purchase = Purchase
        this.cart = []
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public add(purchase: any) {
        this.cart.push(purchase)
    }

    public remove(index) {
        this.cart.splice(index, 1)
    }

    get() {
        return this.cart
    }

    public total() {
        var result = 0;
        this.cart.forEach((ticket) => {
            if (ticket.price) { result = Number(result + Number(ticket.price)) }
        })
        return result;
    }
   

    public makeTransaction(callback: any) {
        
        var that = this
        var total = that.cart.length
        var counter = 0
        
        that.Purchase.setUid(this.uid)

        that.cart.forEach((product)=> {

            that.Purchase.save(product, (response)=>{

                that.responses.push(response)
                counter = (counter + 1)
                
                if (counter == total) {
                    callback(that.responses)
                }
            })

        })
    }

    public getList(callback: any) {
        this.Purchase.setUid(this.uid)
        this.Purchase.list(callback)
    }
}