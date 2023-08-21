interface Designer {
    getItems(): any[];
    setItems(items: any[]): void;
}
declare class Container extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set selected(value: boolean);
    get selected(): boolean;
    get designerType(): boolean;
    getItems(data: DataTransfer): any[];
    setItems(items: any): void;
}
