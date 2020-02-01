/*
 * user.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseUserService } from './../firebase/firebase.user.service'

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private User: any

    public user = { 
        uid: "",
        name: "", 
        surname: '',
        telephone: '',
        bi: "",
        email:"", 
        password: "",
    }

    public constructor(User: FirebaseUserService) {
        this.User = User
    }

    public valid(user: any, mirror: String = "") {

        var valid = { 
            check: false, 
            notifications: [], 
            alerts: {
                name: false,
                surname: false,
                telephone: false,
                bi: false,
                email: false,
                password: false,
            },  
        }

        if (mirror.length == 0) {
            mirror = user.password
        }

        if (!name(user.name)) {
            valid.notifications.push("O nome precisa ter no mínimo 5 letras")
            valid.alerts.name = true
        }

        if (!surname(user.surname)) {
            valid.notifications.push("O sobrenome precisa ter no mínimo 3 letras.")
            valid.alerts.surname = true
        }

        if (!telephone(user.telephone)) {
            valid.notifications.push("O telfone precisa ter no mínimo 11 números.")
            valid.alerts.telephone = true
        }

        if (!bi(user.bi)) {
            valid.notifications.push("O Bilhete de identificação precisa conster 11 números")
            valid.alerts.bi = true
        }

        if (!email(user.email)) {
            valid.notifications.push("Email inválido favor corrigir.")
            valid.alerts.email = true
        }

        if (!password(user.password, mirror)) {
            valid.notifications.push("A senha precisa ter no mínimo 8 caracterres.")
            valid.notifications.push("As senhas precisam ser iguais")
            valid.alerts.password = true
        }

        valid.check = (
            name(user.name)
            && surname(user.surname)
            && telephone(user.telephone)
            && bi(user.bi)
            && email(user.email)
            && password(user.password, mirror)
        ) ? true : false

        function name(name: String) {
            return (name.length >= 3) ? true : false
        }

        function surname(surname: String) {
            return (surname.length >= 3) ? true : false
        }

        function telephone(telephone: String) {
            return (telephone.length >= 11) ? true : false
        }

        function bi(bi: String) {
            return (bi.length >= 11) ? true : false
        }

        function email(email: String) {
            return (email.length >= 6 && email.indexOf("@") != -1 && email.indexOf(".com") != -1) ? true : false 
        }

        function password(password: String, mirror: String) {
            return (password.length >= 8 && password == mirror) ? true : false
        }

        return valid
    }

}