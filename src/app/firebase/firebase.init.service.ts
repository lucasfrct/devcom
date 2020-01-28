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

    public fisebase = null;
    
    public response = { code: "", message: "", user: null, error: null}

    constructor() {
        this.fisebase = onInitFirebase(this.firebaseConfig)
    }

    scope(callback) {
        return this.fisebase.auth().onAuthStateChanged(callback)
    }

    on() {
        return this.fisebase
    }

    db() {
        return this.fisebase.firestore()
    }
    
}


// Iniciar o firebase apos caregar todos os modulos
function onInitFirebase(firebaseConfig) {

    var state = "OFFLINE";                                                              // estado do servico

    if (typeof firebase === "object") {                                                 // caso seja um objeto
        state = "ONLINE";                                                               // set satate online
        firebase.initializeApp(firebaseConfig)                                          // Initialize Firebase SGDB
    } else {                                                                            // caso nao seja um objeto
        firebase = null;                                                                // Set null SGBD
    }

    console.log("MODULE FIREBASE: ",state);
    return firebase
}