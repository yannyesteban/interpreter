declare class ButtonDesigner extends HTMLElement {
    private _data;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    set caption(value: string);
    get caption(): string;
    set name(value: string);
    get name(): string;
    set type(value: string);
    get type(): string;
    get designerType(): boolean;
    set dataSource(data: any);
    get dataSource(): any;
}
