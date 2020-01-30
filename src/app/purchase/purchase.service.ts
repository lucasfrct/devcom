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
    private purchase: any
    private cart: any
    private db = null
    private responses = []

    public constructor(purchase: FirebasePurchaseService) {
        this.purchase = purchase
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public setCart(purchase: any) {
        this.cart = []
        this.cart = this.cart.concat(purchase)
    }

    public makeTransaction(callback: any) {
        
        var that = this
        var total = that.cart.length
        var counter = 0
        
        that.purchase.setUid(this.uid)

        that.cart.forEach((product)=> {

            that.purchase.save(product, (response)=>{

                that.responses.push(response)
                counter = (counter + 1)
                
                if (counter == total) {
                    callback(that.responses)
                }

                console.log("SAVED PRODUCT: ", response, "COUNTER: ", counter, "TOTAL: ", total)
            })

        })
    }
}