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

    private purchase: any
    private cart = []
    private db = null
    private uid: String
    private count = 0
    private responses = []

    public constructor(purchase: FirebasePurchaseService) {
        this.purchase = purchase
    }

    public add(product: any) {
        product.pid = this.generatePId()
        this.cart.push(product)
    }

    public remove(pid: String) {
        this.cart.forEach((product, index)=> {
            if (product.pid == pid) {
                delete this.cart[index]
            }
        })
    }

    private generatePId() {
        return (this.count + 1)
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public save(callback: any) {
        var that = this
        var total = that.cart.length
        var counter = 0

        that.purchase.uid = that.uid

        that.cart.forEach((product)=> {
            delete product.pid
            that.purchase.save(product, (response)=>{
                that.responses.push(response)
                if (counter == total) {
                    callback(that.responses)
                } else {
                    counter = (counter + 1)
                }
            })
        })
    }
}