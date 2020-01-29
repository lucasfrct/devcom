import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-tickets',
  	templateUrl: './tickets.component.html',
  	styleUrls: ['./tickets.component.css']
})

export class TicketsComponent implements OnInit {

	@Input() set currentTicket(tk: any) {
		console.log("CURRENT TICKET: ", tk)
		if(tk) {
			this.tickets.push(tk)
		}
	}

	public tickets = []

	public ticket = {
		owner: "Lucas Costa",
		event: {
			name: "Castelos dos Filhos das Ruas",
			logoUrl: "assets/images/sources/logo-1.jpeg",
			date:"08 de Fev de 2020",
			hour: "20h00",
			address: "Cine Atlantico",
		},
		seat: {
			session: "A",
			number: "01",  // número do assento
			type: "VIP",
		},
		edition: {
			circulation: "01", // número da tiragem
			serial: "0001", 	// número de série
		},
	}  

  	constructor() { 
		  //this.tickets.push(this.ticket)
		  //console.log(this.tickets)
	  }

	ngOnInit() { }

	getEvent() {
		return {
			name: "Dope Muzik",
			logoUrl: "",
			date:"08/02/2020",
			hour: "20h",
			address: "Centro",
		}
	}

	getNumberTicket() {
		return {
			circulation: "01",
			serial: "0001",
		}
	}

	getSeat() {
		return {
			session: "A",
			number: "01",
			type: "VIP",
		}
	}
}
