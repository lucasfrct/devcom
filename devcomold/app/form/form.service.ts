/*
 * form.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})

export class FormService {

    public control = {
        eye: "visibility",
        password: "password",
    }

    public constructor() {

    }

    public toggleEye() {
        return this.control.eye = (this.control.eye == "visibility") ? "visibility_off" : "visibility"
    }

    public togglePassword() {
        return this.control.password = (this.control.password == "password") ? "text" : "password"
    }
}