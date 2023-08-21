import "./Tab.js";
import { IForm } from "./App.js";
export declare class WHForm extends HTMLElement implements IForm {
    _caption: any;
    static get observedAttributes(): string[];
    constructor();
    isValid(arg?: any): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set elements(elements: any);
    addField(main: any, field: any): void;
    addPage(main: any, info: any): void;
    addFieldset(main: any, info: any): void;
    addTab(main: any, info: any): void;
    evalElement(main: any, element: any): void;
    set dataSource(dataSource: any);
    set caption(value: any);
    get caption(): any;
    set nav(value: string);
    get nav(): string;
    getValues(): {};
    _setCaption(caption: any): void;
    _getBody(): Element;
    valid(): void;
}
