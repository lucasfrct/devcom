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

    transform(items: any[], filter:any): any {

        if(!items || !filter) {
            return  []
        }

        return items.filter((item)=> {
            return item.status == filter.status
        })
    }
}