declare class WaitLayer extends HTMLElement {
    _parent: HTMLElement;
    _pointerEvents: any;
    _position: any;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set type(value: string);
    get type(): string;
    test(): void;
}
