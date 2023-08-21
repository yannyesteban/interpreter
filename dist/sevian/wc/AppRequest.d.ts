export declare class AppRequest extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set name(value: string);
    get name(): string;
    set data(value: any);
    get data(): any;
    send(): void;
    set type(value: string);
    get type(): string;
}
