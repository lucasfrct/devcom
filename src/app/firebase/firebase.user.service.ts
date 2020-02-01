/*
 * firebase.user.service.ts
 * Autor: Lucas Costa
 * Data: Janeirode 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'


@Injectable({
    providedIn: 'root'
})

export class FirebaseUserService {

    private collection = "users"
    private Collection: any
    private uid: String
    private response: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService) {
        this.response = Init.response()
        
        this.scope = Init.scope
        this.Subscribe = Init.Subscribe
        this.NotifyAll = Init.NotifyAll
        this.copy = Init.copy
        this.extend = Init.extend

        this.Collection = Init.collection(this.collection)
    }

    public setUid(uid: String) {
        this.uid = uid
    }

    public set(user: Object, callback: Object = null) {
        
        this.Subscribe(callback)
        
        if (this.uid && this.uid.length > 5) {
            this.Collection
                .doc(this.uid)
                .set(user, {merge: true})
                .then(()=>{
                    this.response.code = "201"
                    this.response.message = "Usuario Atualizado com sucesso!"
                    this.response.user = user
                })
                .catch((error)=> {
                    this.response.code = "400"
                    this.response.message = "Ocorreu alguum Erro"
                    this.response.user = user
                    this.response.error = error
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                })

        } else {
            this.response.code = "400"
            this.response.message = "Usuario precisa estar logado"
            this.response.user = user
            this.NotifyAll(this.response)
        }
    }

    public load(uid: String, callback: Object = null) {
        
        console.log("LOAD",uid)

        if (uid && uid.length > 0) {

            this.Subscribe(callback)

            this.Collection
                .where("uid","==", uid)
                .get()
                .then((query)=> {
                    var user = { uid: "" }

                    query.forEach((doc)=>{ user = doc.data() })
                    
                    this.response.code = "201"
                    this.response.message = "Usuário carregado com sucesso"
                    this.response.user = user
                })
                .catch((error)=> {
                    this.response.code = "400"
                    this.response.message = "Usuário carregado com sucesso"
                    this.response.error = error
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                })

            } else {
                this.response.code = "400"
                this.response.message = "O usuário precisa estar logado"
                this.NotifyAll(this.response)
            }

    }
}