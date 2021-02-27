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
		if (index >= 0) { 
			this.index = index
			this.control.displayDelete = true
		}
	}

	@Input() set onQr(state: any) {
		this.control.displayQr = state
	}

	@Output() onRemove = new EventEmitter()

	public index: any

	public control = {
		displayDelete: false,
		displayQr: false,
		qrcode: false,
	}

	public ticket = {
		uid: "",
		eid: "",
		pid: "",
		tid: "",
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
			type: "",
		},
		edition: {
			circulation: "",
			serial: "",
		},
		price: "",
	}  

  	constructor() { }

	ngOnInit() { }

	deleteTicket() {
		this.onRemove.emit(this.index)
	}

	public visibleQRCode() {
		this.control.qrcode = !this.control.qrcode
	}

}
