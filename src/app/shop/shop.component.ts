import { Component, OnInit } from '@angular/core';
import { PurchaseService } from './../purchase/purchase.service'

declare var M: any

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

    private uid: any
    private counter = 0
    private observers = []

    public control = {
        modal: null,
        total: 0,
    }

    public ticket = {
        owner: "",
        event: {},
        seat: { session: "", type: "" },
        edition: {},
        price: "0"
    }

    public purchase = []

    public event = {
        name: "Castelos dos Filhos das Ruas",
        folderUrl: "assets/images/sources/art-1.jpeg",
        logoUrl: "assets/images/sources/logo-1.jpeg",
        date:"08 de Fev de 2020",
        hour: "20h00",
        address: "Cine Atlantico",
    }

    constructor() {
        
     }

    ngOnInit() { }

    public onChange() {
        this.ticket.price = (this.ticket.seat.type == "VIP") ? "5000" : "3000"
    }

    public addTicked(){

        if (this.validate(this.ticket).check) {

            this.control.modal = true

            this.ticket.event = this.event
            this.getTicketEdition((edition)=> {

                this.control.modal = false

                this.ticket.edition = edition
                this.purchase.push(this.copy(this.ticket))
                this.calTotal(this.purchase)
                M.toast({html: 'Ingresso adicionado'})
            })

            

        }

    }

    private calTotal(purchase: any) {
        var that = this
        var calc = 0
        purchase.forEach((tk)=> {
            calc = (calc + Number(tk.price))
        })
        return this.control.total = calc
    }

    private getTicketEdition(callback: any){
        console.log("GET EDITION")
        callback({ circulation: "01", serial: "000001" })
    }

    private validate(ticket: any) {
        var valid = { check: false }

        
        if (!name(ticket.owner)) {
            M.toast({html: 'Favor digitar um nome com mais de 3 letras'})
        }

        if (!seatSession(ticket.seat.session)) {
            M.toast({html: 'Favor Selecionar um assento.'})
        }
        
        if(!seatType(ticket.seat.type)) {
            M.toast({html: 'Favor Selecionar um tipo de ingresso.'})
        }

        valid.check = (name(ticket.owner) && seatSession(ticket.seat.session) && seatType(ticket.seat.type)) ? true : false

        return valid

        function name(name: String) {
            return (name.length >= 3) ? true : false
        }

        function seatSession(session: any) {
            return  (session.length >= 3) ? true : false
        }

        function seatType(type: any) {
            return ("VIP" == type || "Normal" == type) ? true : false
        }
    }

    public Subscribe(command) {
        this.observers.push(command)
    }

    public NotifyAll(command) {
        this.observers.forEach((ObserverFunstion)=> {
            ObserverFunstion(command)
        })

        this.observers = []
    }

    private copy(obj: any) {
        return JSON.parse(JSON.stringify(obj))
    }

}
