/*
 * firebase.user.service.ts
 * Autor: Lucas Costa
 * Data: Janeirode 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseInitService } from './../firebase/firebase.init.service'
import { ConsoleReporter } from 'jasmine'


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

    public set(user: any, callback: Object = null) {
        
        this.Subscribe(callback)
        
        if (this.uid && this.uid.length > 5) {
            user.uid = this.uid
            
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
                    this.response.message = "Ocorreu algum Erro ao atulaizar Usuário"
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

    public get(callback: Object = null) {
        var that = this
        var user = { uid: that.uid}


        that.Subscribe(callback)

        if (that.uid && that.uid.length > 5) {

            that.Collection
                .where("uid","==", that.uid)
                .get()
                .then((query)=> {

                    query.forEach((doc)=> {
                        user.uid = doc.id
                        user = that.extend(user, doc.data()) 
                    })
                    
                    that.response.code = "200"
                    that.response.message = "Usuário carregado com sucesso"
                    that.response.user = user
                })
                .catch((error)=> {
                    that.response.code = "400"
                    that.response.message = "Ocirreu um erro ao carregar o usuário"
                    that.response.user = user
                    that.response.error = error
                })
                .finally(()=> {
                    that.NotifyAll(that.response)
                })

            } else {
                that.response.code = "400"
                that.response.message = "O usuário precisa estar logado"
                that.response.user = user
                that.NotifyAll(that.response)
            }

    }
}