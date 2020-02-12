/*
 * firebase.sms.service.tsts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */

 import { Injectable } from '@angular/core'
 import { FirebaseInitService } from './../firebase/firebase.init.service'

 declare var window

 @Injectable({
     providedIn: 'root'
 })

 export class FirebaseSMSService {

    private firebase: any
    private response: any
    
    public Subscribe: any
    public NotifyAll: any 

    public constructor(Init : FirebaseInitService) {

        this.firebase = Init.on()
        this.response = Init.response()

        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll

        // == INIT CONFIG ==
        this.definelanguage()
    }

    public definelanguage(lang: String = "") {
        
        if(lang) {
            this.firebase.auth().languageCode = lang
        } else {
            this.firebase.auth().useDeviceLanguage()
        }
    }

    public reCaptcha() {

        window.recaptchaVerifier = new this.firebase
            .auth
            .RecaptchaVerifier("sign", { size: "invisible" })
    }

    public send(telephone: String, callback: Object = null) {

        this.environmenttest()

        this.Subscribe(callback)

        var appVerifier = window.recaptchaVerifier

        this.firebase
            .auth()
            .signInWithPhoneNumber(telephone, appVerifier)
            .then((result)=> {

                window.confirmationResult = result
                this.response.id = result.verificationId
                this.response.code = "200"
                this.response.message = "SMS enviado com sucesso"

            }).catch((error)=> {
                
                this.response.code = "400"
                this.response.message = "Erro ao Enviar SMS"
                this.response.error = error

            }).finally(()=> {

                this.NotifyAll(this.response)

            })
    }

    public code(code: String, callback: Object = null) {
        
        this.Subscribe(callback)

        window.
            confirmationResult
            .confirm(code)
            .then((response)=> {

                this.response.code = "201"
                this.response.message = "Código validade com sucesso"
                this.response.user = response.user

            })
            .catch((error)=> {

                this.response.code = "400"
                this.response.message = "Erro ao validar o código"
                this.response.error = error

            })
            .finally(()=> {
                this.NotifyAll(this.response)
            })
    }

    private environmenttest() {
        this.firebase.auth().settings.appVerificationDisabledForTesting = false;
    }

 }