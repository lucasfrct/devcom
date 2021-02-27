/*
 * url.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
    providedIn: 'root'
})

export class UrlService {

    private Router: any 
    private uri: any
    private checkin: String = ""

    public constructor(Router: Router) {
        this.Router = Router
    }

    public capture() {
        return this.uri = this.Router.url
    }

    public checkIn() { }

    private params(param: any) {
        
        var uri = this.capture()
        var response = ""
        var filter = "/?"+ param + "="

        if (uri && (uri.indexOf(filter) != -1) && param) {
            response = String(decodeURIComponent(uri).replace(filter, ""))
        }

        return response
    }

}