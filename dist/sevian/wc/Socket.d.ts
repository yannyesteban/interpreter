declare class WHSocket extends HTMLElement {
    private ws;
    private timer;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldVal: string, newVal: string): void;
    set server(value: string);
    get server(): string;
    set status(value: string);
    get status(): string;
    set reconnection(value: string);
    get reconnection(): string;
    private connect;
    disconnect(): void;
    private onOpen;
    private onMessage;
    private onClose;
    private onError;
    send(body: {}): void;
}
