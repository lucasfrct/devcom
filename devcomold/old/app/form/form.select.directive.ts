/*
 * form.select.directive.ts
 * Autor: Lucas Costa
 * Data: janeiro de 2020
 */
import { Directive, ElementRef, OnInit } from '@angular/core'

declare let M: any

@Directive({
    selector: ".select",
    jit: true,
})

export class FormSelectDirective implements OnInit {

    private instanceSelect: any

    private element: any
    private native: any

    public constructor(el: ElementRef) {
        var that = this
        this.element = el
        this.native = el.nativeElement
    }

    ngOnInit(){
        this.instanceSelect = M.FormSelect.init(this.native);
        M.updateTextFields()
    }
}