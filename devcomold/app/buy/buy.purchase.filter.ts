/*
 * buy.filter.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Pipe, PipeTransform } from '@angular/core'

declare var c: any

@Pipe({
    name: "purchaseFiiter",
    pure: false,
})

export class BuyPurchaseFilter implements PipeTransform {
    private items: any

    transform(items: any[], filter:any): any {

        if (!items || !filter || filter.status == "") {
            this.items = items
        } else {
            this.items = items.filter((item)=> {
                return item.status == filter.status
            })
        }
        return this.items
    }
}