declare class LastActive extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set container(value: string);
    get container(): string;
    set designer(value: string);
    get designer(): string;
}
