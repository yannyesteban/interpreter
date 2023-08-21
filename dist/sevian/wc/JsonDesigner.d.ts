declare const Menu1: {
    name: string;
    caption: string;
    className: string;
    groups: {
        name: string;
        items: {
            name: string;
            caption: string;
            input: string;
            type: string;
        }[];
    }[];
    fields: {
        name: string;
        caption: string;
        input: string;
        type: string;
    }[];
};
declare class JsonDesigner extends HTMLElement {
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
}
