/*
 * firebase.login.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'

//var _Init: new FirebaseInitService

@Injectable()

export class FirebaseLoginService {

    private init: any
    private firebase: any
    private db: any
    private response: any
    private user: any

    public constructor(init: any) {
        this.init = init
        console.log("INIT: ", init)
    }
}