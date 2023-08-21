export declare class WHSelect extends HTMLElement {
    static get observedAttributes(): any[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set data(options: any);
}
