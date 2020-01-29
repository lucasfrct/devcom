import { Component, OnInit } from '@angular/core';

declare var M: any

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {
    
    private uid: any

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
    
    public event = {}
    
    public constructor() {
        //this.uid = user.uid
    }
    
    ngOnInit() { 
        this.event = this.getEvent()
    }
    
    public onChange() {
        this.ticket.price = (this.ticket.seat.type == "VIP") ? "5000" : "3000";
    }
    
    public addTicked() {

        var that = this
        
        if (that.validate(that.ticket).check) {
            
            that.control.modal = true
            
            that.ticket.event = that.event
            
            that.getTicketEdition((edition) => {
                
                that.control.modal = false;
                that.ticket.edition = edition;
                
                that.purchase.push(that.copy(that.ticket))

                that.control.total = that.calcTotal(that.purchase)

                M.toast({ html: 'Ingresso adicionado' })

            });
        }
    }

    public deleteTicket(index: any) {
        this.purchase.splice(index, 1)
        this.control.total = this.calcTotal(this.purchase)
    }

    public onDelete(index: any) {
        this.deleteTicket(index)
    }

    private getEvent() {
        return  {
            name: "Castelos dos Filhos das Ruas",
            folderUrl: "assets/images/sources/art-1.jpeg",
            logoUrl: "assets/images/sources/logo-1.jpeg",
            date: "08 de Fev de 2020",
            hour: "20h00",
            address: "Cine Atlantico",
        }
    }
    
    private calcTotal(purchase: any) {
        var result = 0;
        purchase.forEach((ticket) => {
            if (ticket.price) {
                result = (result + Number(ticket.price))
            }
        })
        return result;
    }
   
    private getTicketEdition(callback: any) {
        callback({ circulation: "01", serial: "000001" })
    }

    public finallyPurchase(purchase) {
        console.log("Finally: ", purchase)
    }
    
    private validate(ticket: any) {
        var valid = { check: false };
        
        if (!name(ticket.owner)) {
            M.toast({ html: 'Favor digitar um nome com mais de 3 letras' });
        }
        
        if (!seatSession(ticket.seat.session)) {
            M.toast({ html: 'Favor Selecionar um assento.' });
        }
        
        if (!seatType(ticket.seat.type)) {
            M.toast({ html: 'Favor Selecionar um tipo de ingresso.' });
        }
        
        valid.check = (
            name(ticket.owner) 
            && seatSession(ticket.seat.session) 
            && seatType(ticket.seat.type)
        ) ? true : false;
        
        return valid;
        
        function name(name: String) {
            return (name.length >= 3) ? true : false;
        }
        
        function seatSession(session: any) {
            return (session.length >= 3) ? true : false;
        }
       
        function seatType(type: any) {
            return ("VIP" == type || "Normal" == type) ? true : false;
        }
    }
    
    private copy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}
