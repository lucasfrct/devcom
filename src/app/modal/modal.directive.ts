/*
 * modal.directive.ts
 * Autor: Lucas Costa
 * Data: Janeiro de 2020
 */
import { Directive, ElementRef, Input } from '@angular/core'

declare const M: any

@Directive({
    selector: ".modal",
    jit: true,
})

export class ModalDirective {

    private instanceModal: any
    private element: any
    private native: any

    @Input() set modalControl(control: boolean) {
        (true == control) ? this.instanceModal.open() : this.instanceModal.close()
    }
    
    public constructor(el: ElementRef) { 
        this.element = el
        this.native = el.nativeElement
        this.instanceModal = M.Modal.init(this.native, { preventScrolling: true, dismissible: true })
    }

}