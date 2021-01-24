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

    private Init: any
    private Collection: any
    
    private collection = "users"
    private uid: String
    private response: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public constructor(Init: FirebaseInitService) {
        
        this.Init = Init
        
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
        
        if (this.uid && this.uid.length > 15) {
            
            user.uid = this.uid
            
            this.Collection
                .doc(String(this.uid))
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
                    this.clean()
                })

        } else {
            this.response.code = "400"
            this.response.message = "Usuario precisa estar logado"
            this.response.user = user
            this.NotifyAll(this.response)
            this.clean()
        }
    }

    public get(callback: Object = null) {
        
        var user = {uid: this.uid}

        this.Subscribe(callback)

        if (this.uid && this.uid.length > 15) {

            this.Collection
                .where("uid","==", String(this.uid))
                .get()
                .then((query)=> {

                    query.forEach((doc)=> {
                        user = this.extend(user, doc.data()) 
                    })
                    
                    this.response.code = "200"
                    this.response.message = "Usuário carregado com sucesso"
                    this.response.user = user
                })
                .catch((error)=> {
                    this.response.code = "400"
                    this.response.message = "Ocirreu um erro ao carregar o usuário"
                    this.response.user = user
                    this.response.error = error
                })
                .finally(()=> {
                    this.NotifyAll(this.response)
                    this.clean()
                })

            } else {
                this.response.code = "400"
                this.response.message = "O usuário precisa estar logado"
                this.response.user = user
                this.NotifyAll(this.response)
                this.clean()
            }

    }

    public clean(){
        this.response = this.Init.response()
    }
}