import { Component, OnInit } from '@angular/core';
import { UrlService } from './url.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    private Url: any
    private uri: any
    private token: String = ''

    private check: any

    public control = {
        modalTicket: false,
        modalMessage: "",
        sliders: [ 
            { link: "/devcom", img: "assets/images/capa.jpg"},
            { link: "/livemusic", img: "assets/images/01.jpg"},
            { link: "/businessconference", img: "assets/images/02.jpg"},
            { link: "/musicparty", img: "assets/images/03.jpg"},
            { link: "/elegantevent", img: "assets/images/04.jpg"} 
        ],
        carousel: [ 
            { link: "/businessconference", img: "assets/images/02.jpg"},
            { link: "/livemusic", img: "assets/images/01.jpg"},
            { link: "/musicparty", img: "assets/images/03.jpg"},
            { link: "/devcom", img: "assets/images/capa.jpg"},
            { link: "/elegantevent", img: "assets/images/04.jpg"} 
        ],
        categories: [
            {   
                name: "Todos",
                search: "all" , 
                events: [
                    { name: "event 01", link: "/", img:"assets/images/01.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                    { name: "event 02", link: "/", img:"assets/images/02.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                    { name: "event 03", link: "/", img:"assets/images/03.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                ],
            },
            { 
                name: "Recomendados", 
                search: "recommended",
                events: [
                    { name: "event 01", link: "/", img:"assets/images/01.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                    { name: "event 04", link: "/", img:"assets/images/04.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                ],
            },
            { 
                name: "Hoje", 
                search: "today",
                events: [
                    { name: "event 02", link: "/", img:"assets/images/02.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                    { name: "event 03", link: "/", img:"assets/images/03.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
    
                ], 
            },
            { 
                name: "Final de Semana", 
                search: "wqeekend",
                events: [
                    { name: "event 03", link: "/", img:"assets/images/03.jpg", description: "Descrição resumida do evento com data, lugar e objetivos bem definidos"},
                ],
            }
        ]

    }
  
    public constructor(Url: UrlService) { 
        this.Url = Url
    }

    public ngOnInit() {
        //this.checkTicket()
    }

    public checkTicket() {
        
        /*if (this.Url.params("checkin")) {
            
            this.control.modalTicket = true
            this.control.modalMessage = this.Url.params("checkin")
            console.log("DATA: ", this.control.modalMessage)

        }*/
    }
}
