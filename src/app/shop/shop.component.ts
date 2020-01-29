import { Component, OnInit } from '@angular/core';
import { PurchaseService } from './../purchase/purchase.service'

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

    private uid: any
    private counter = 0
    private observers = []
    public events = []

    public sessions = []

    public event = {
        name: "Castelos dos Filhos das Ruas",
        folderUrl: "assets/images/sources/art-1.jpeg",
        logoUrl: "assets/images/sources/logo-1.jpeg",
        date:"08 de Fev de 2020",
        hour: "20h00",
        address: "Cine Atlantico",
    }

    public seat = {
        session: "A",
        number: "01",  // número do assento
        type: "VIP",
    }

    public ticket = {
		owner: "Lucas Ferreira Costa",
		event: { },
		seat: { },
		edition: {
			circulation: "01", // número da tiragem
			serial: "0001", 	// número de série
		},
    }  
    
    public tickets = []

    constructor() {
        
     }

    ngOnInit() { 
        this.ticket.event = this.event
        this.ticket.seat = this.seat
        this.sessions = ["A 01", "A 02", "B 01", "B 02"]
    }

    public registerEvencts(evencts: any) {
        var that = this
        that.counter = 0
        evencts.array.forEach((event)=> {
            that.counter = (that.counter + 1)
            event.eid = that.counter
            //*that.evencts.push(event)
        });
    }

    public addTicked(){
        console.log("CLICK")
        this.tickets.push(this.ticket)
        console.log("CLICK", this.tickets)
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

}
