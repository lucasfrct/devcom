/*
 * sidenav.directive.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Directive, ElementRef, Input, OnInit } from '@angular/core'

declare let M: any

@Directive({
    selector: ".sidenav",
    jit: true,
})

export class SidenavDirective implements OnInit {

    private instanceSidenav: any
    private element: any
    private native: any

    @Input() set sidenavControl(control: boolean) {
        (true == control) ? this.instanceSidenav.open() : this.instanceSidenav.close()
    }
    
    public constructor(el: ElementRef) { 
        this.element = el
        this.native = el.nativeElement
        this.instanceSidenav = M.Sidenav.init(this.native)
    }

    ngOnInit() {
        
    }

}