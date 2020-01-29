import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-ticket',
  	templateUrl: './ticket.component.html',
  	styleUrls: ['./ticket.component.css']
})

export class TicketComponent implements OnInit {

	@Input() set onTicket(tk: any) {
		if (tk) { this.ticket = Object.assign(this.ticket,tk) }
	}

	@Input() set onRegister(index: any) {
		if (index >= 0) { this.index = index }
	}

	@Output() onRemove = new EventEmitter()

	public index: any

	public ticket = {
		owner: "",
		event: {
			name: "",
			FolderUrl: "",
			logoUrl: "",
			date:"",
			hour: "",
			address: "",
		},
		seat: {
			session: "",
			number: "", 
			type: "",
		},
		edition: {
			circulation: "",
			serial: "",
		},
	}  

  	constructor() { }

	ngOnInit() { }

	deleteTicket() {
		this.onRemove.emit(this.index)
	}

	
}
