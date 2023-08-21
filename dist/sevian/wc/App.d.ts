import "./AppRequest.js";
export type selector = string;
interface AppAction {
    id?: string;
    setPanel?: string;
    type?: string;
    element?: string;
    name?: string;
    source?: string;
    method?: string;
    eparams?: object;
    resToken?: string;
}
interface AppRequest {
    method?: string;
    headers?: {};
    type?: string;
    panel?: selector;
    confirm?: string;
    valid?: boolean;
    form?: selector | HTMLFormElement;
    body?: object;
    header?: {
        [key: string]: string;
    };
    actions: AppAction[];
}
export interface IForm {
    getValues(): any;
    isValid(arg?: any): boolean;
}
interface FetchInfo {
    method?: string;
    mode?: string;
    headers?: any;
    body?: any;
}
interface RequestInfo {
    method?: string;
    mode?: string;
    sendTo?: selector;
    dataForm?: any;
    request?: any;
    headers?: any;
    body?: any;
    requestFunctions?: any;
    requestFunction?: any;
    blockWhile?: selector[];
    confirm?: string;
    valid: any;
}
export interface IResponse {
    id: string;
    type: string;
    data: any;
    reply?: string;
    [key: string]: any;
}
interface IElement {
    id: string;
    wc: string;
    iClass: string;
    component: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    attrs: any;
    props: any;
    data: any;
    setPanel: string;
    appendTo: string;
}
export declare class App extends HTMLElement {
    modules: any[];
    components: any[];
    _e: any[];
    token: string;
    sid: string;
    xx: string;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    connectedCallback(): void;
    decodeResponse(data: IResponse[], requestFunctions?: (config: any) => void[]): void;
    set cssSheets(data: any);
    set paz(x: string);
    get paz(): string;
    test(): void;
    initApp(): void;
    whenComponent(module: any): Promise<unknown>;
    updateElement(info: any): void;
    importModule(element: any): void;
    initElement(element: IElement | IResponse): void;
    set jsModules(jsFiles: any);
    set addClass(classes: any);
    set server(value: string);
    get server(): string;
    set name(value: string);
    get name(): string;
    send(info: FetchInfo): Promise<unknown>;
    go(info: RequestInfo): void;
    sendForm(info: AppRequest): void;
}
export {};
