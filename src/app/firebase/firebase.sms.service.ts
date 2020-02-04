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
        console.log("SMS")

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
        window.recaptchaVerifier = new this.firebase.auth.RecaptchaVerifier(
            "sign", {
                "size": "invisible",
                "callback": (response)=> {
                    console.log("Subimit Recapticha")
                }              
            }
        )
    }

    public sendCode(telephone: String, callback: Object = null) {

        this.firebase.auth().settings.appVerificationDisabledForTesting = true;

        this.Subscribe(callback)

        var appVerifier = window.recaptchaVerifier

        this.firebase
            .auth()
            .signInWithPhoneNumber(telephone, appVerifier)
            .then((result)=> {

                console.log("SEND CODE RESULT", result)
                window.confirmationResult = result

            }).catch((error)=> {
                
                console.log("SEND CODE ERROR: ", error)

            }).finally(()=> {

                this.NotifyAll(this.response)

            })
    }

    public validateCode(code: String) {
        window.confirmationResult.confirm(code)
            .then((response)=> {
                console.log("VALIDATE CODE RESPONE: ", response)
            })
            .catch((error)=> {
                console.log("VALIDATE CODE ERROR: ", error)
            })
            .finally()
    }

    public Authenticate(telephone: String , callback: Object = null) {
        
        this.sendCode(telephone)

    }
 }

 /*
    linguagem 
        firebase.auth().languageCode = 'it';

    Usar reCAPTCHA invisível

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'sign-in-button', {
            'size': 'invisible',
            'callback': function(response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
    })

    ENVIAR SMS CODE
    var phoneNumber = getPhoneNumberFromUserInput();
    var appVerifier = window.recaptchaVerifier;
    firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
        }).catch(function (error) {
            // Error; SMS not sent
            // ...
        });


    CONFIRMAR TOKEN SMS DE ACESSO
    var code = getCodeFromUserInput();
    confirmationResult
        .confirm(code)
        .then(function (result) {
        // User signed in successfully.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
    });

 */