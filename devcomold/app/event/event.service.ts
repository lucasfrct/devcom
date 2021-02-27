/*
 * event.service.ts
 * Autor Lucas Costa
 * Data: Janeiro de 2020
 */
import { Injectable } from '@angular/core'
import { FirebaseEventService } from './../firebase/firebase.event.service'

@Injectable({
    providedIn: "root"
})

export class EventService {

    private Event: any
    
    private uid: any
    private eid: any

    public scope: any
    public Subscribe: any
    public NotifyAll: any
    public copy: any
    public extend: any

    public current: any
    
    public constructor(Event: FirebaseEventService) {
        this.Event = Event

        this.scope = Event.scope
        this.Subscribe = Event.Subscribe
        this.NotifyAll = Event.NotifyAll
        this.copy = Event.copy
        this.extend = Event.extend

        this.clean()

    }

    public setUid(uid: String) {
        this.uid = uid
        this.current.uid = uid
    }

    public setEid(eid: String) {
        this.eid = eid
        this.current.eid = eid
    }

    public add(callback) {
        this.Event.setUid(this.uid)
        this.Event.set(this.current, callback)
    }

    public load(callback) {

        this.Subscribe(callback)
        
        this.Event.setUid(this.uid)
        
        this.Event.get(null, (response)=> {
            
            if ("400" != response.code && response.events.length > 0) {
                this.current = response.events[0]
            }

            this.NotifyAll(response)
        })
    }

    public getTicketEdition(type: any, callback: any) {
        
        var edition = { circulation: "A1", serial: "" }

        this.Subscribe(callback)

        this.Event.setUid(this.current.eid)

        this.Event.get(this.current.eid, (response)=> {

            
            if ("400" != response && response.events.length > 0) {
                this.current = this.Event.extend(this.current, response.events[0])
                edition.serial = this.serial(this.current.tickets.normal.sold)
            }
            
            this.NotifyAll(edition)

        })

    }

    public serial(str : String) {
        var numGenerate = this.pad(Math.floor(Math.random() * 1000), 4)
        var numSerial = this.pad((Number(str) + 1), 3)
        return String(numSerial + "-" + numGenerate)
    }

    private pad(num, size) {
        var s = String(num) + ""
        while (s.length < Number(size)) {
            s = "0" + s
        }
        return String(s)
    }

    public clean() {
        this.current = {
            uid: "",
            eid: "",
            name: "",
            folderUrl: "",
            logUrl: "",
            date: "",
            hour: "",
            address: "",
            tickets: {},
        }
    }
}