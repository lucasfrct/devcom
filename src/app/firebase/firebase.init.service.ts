/*
 * firebase.init.service.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'

declare var firebase: any

@Injectable({
    providedIn: "root"
})

export class FirebaseInitService {

    private observers: any
    
    private firebaseConfig = {
        apiKey: "AIzaSyCr0VNqcrCUpn_O_9mn67GdxyTs9XSUJwQ",
        authDomain: "dope-muzik.firebaseapp.com",
        databaseURL: "https://dope-muzik.firebaseio.com",
        projectId: "dope-muzik",
        storageBucket: "dope-muzik.appspot.com",
        messagingSenderId: "623628766783",
        appId: "1:623628766783:web:534553e3a5c80f2e71328a",
        measurementId: "G-70QMM4HJCK"
    }

    private firebase: any;
    private reply = { code: "", message: "", user: null, error: null}

    public constructor() { this.firebase = onInitFirebase(this.firebaseConfig) }
    
    public scope(callback: any) { this.firebase.auth().onAuthStateChanged(callback) }
    
    public on() { return this.firebase }

    public db() { return this.firebase.firestore() }

    public collection(collection: String) {
        return this.db().collection(collection)
    }

    public response(resposnse: any = {}) {
        return JSON.parse(JSON.stringify(Object.assign(this.reply, resposnse)))
    }

    public Subscribe(fn: any) {
        if (typeof this.observers != "object" ) { this.observers = [] }
        if (typeof fn == "function") { this.observers.push(fn) }
    }
    
    public NotifyAll(response = {}) {
        if (this.observers) {
            this.observers.forEach((ObserverFn: any) => {
                ObserverFn(response)
            })
        }
        this.observers = []
    }

    public copy(obj: any) {
        return JSON.parse(JSON.stringify(obj))
    }

    public extend(objA: any, objB: any) {
        return Object.assign(this.copy(objA),this.copy(objB))
    }
}


// Iniciar o firebase apos caregar todos os modulos
function onInitFirebase(firebaseConfig: any) {

    var state = "OFFLINE";                                                              // estado do servico

    if (typeof firebase === "object") {                                                 // caso seja um objeto
        state = "ONLINE";                                                               // set satate online
        firebase.initializeApp(firebaseConfig)                                          // Initialize Firebase SGDB
    } else {                                                                            // caso nao seja um objeto
        firebase = null;                                                                // Set null SGBD
    }

    console.log("MODULE FIREBASE: ", state);
    return firebase
}