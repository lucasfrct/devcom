import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {

    control = {
        bank: false,
        paypal: false,
        unchecked: false,
        selected: ""
    }

    constructor() { }

    ngOnInit() {
    }

    public toggleBank() {
        this.control.bank = !this.control.bank
        this.unchecked(this.control.bank)
        if (this.control.bank) {
            this.control.paypal = false
        }

        this.selected()

    }

    public togglePaypal() {
        this.control.paypal = !this.control.paypal
        this.unchecked(this.control.paypal)

        if (this.control.paypal) {
            this.control.bank = false
        }

        this.selected()
    }

    public unchecked(state: Boolean) {
        return this.control.unchecked = (state) ? true : false
    }

    private selected() {
        if (this.control.bank && !this.control.paypal) {
            this.control.selected = "bank"
        }

        if(!this.control.bank && this.control.paypal) {
            this.control.selected = "paypal"
        }

        if(!this.control.bank && !this.control.paypal) {
            this.control.selected = ""
        }

        return this.selected
    }

    public type() {
        return this.control.selected
    }

    public states() {
        return this.control
    }


}
