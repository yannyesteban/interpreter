export type DataJson = { [key: string]: any };

export interface LRequest {

    headers?: DataJson;
    mode?: string;
    method?:"post" | "get";
    contentType?: string;

    confirm?:string;
    sendTo?: selector | HTMLElement;
    sendForm?: true;
    body?: DataJson;
    valid?: boolean;
    validForm?: boolean;
    validOption?: any;
    globalStore?: true | string[];
    sendStore?: boolean | object;
    blockTo?: boolean | "*" | selector | selector[] | HTMLElement[];
    
    actions?: any[];
    masterData?: DataJson;
}

export type selector = string;

export interface AppComponent {
    valid?: (option?: any) => boolean;
}

export interface PanelInfo {
    panel: string;
    id: string;
    element: string;
    method: string;
    mode: string;
    eparams: any;
}
export interface AppAction {
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
export interface AppRequest {
    method?: string;
    contentType?: string;
    mode?: string;
    type?: string;
    panel?: selector;
    confirm?: string;
    validate?:
        | AppComponent
        | selector
        | HTMLElement
        | ((option?: any) => boolean)
        | { validd: (option?: any) => boolean; option: any };
    validateOption?: any;
    form?: selector | HTMLElement | HTMLFormElement;
    body?: object;
    headers?: { [key: string]: string };
    actions?: AppAction[];
    store?: true | { [key: string]: any };
    reportValidity?: boolean;
    blockLayers?: selector[];
    blockForm?: boolean;
    masterData?: any;
}

export interface HtmlFragment {}

export interface ElementResponse {
    panel?: string;
    setTo?: selector;
    appendTo?: selector;
    do?: string;
    to?: string;
    id?: string;
    mode?: string;
    element: string;
    props: any;
    attrs: any;
    html: string;
    text: string;
    css: string;
    script: string;
    data?: any;
}

export interface IForm {
    getValues(): any;
    isValid(arg?: any): boolean;
}

export interface FetchInfo {
    method?: string;
    mode?: string;
    headers?;
    body?;
}
export interface RequestInfo {
    method?: string;
    mode?: string;
    sendTo?: selector;
    dataForm?;
    request?;
    headers?;
    body?;
    requestFunctions?;
    requestFunction?;
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

export interface IElement {
    do?: string;
    to?: string;
    id: string;
    element: string;
    iClass: string;
    component: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    attrs: any;
    props: any;
    propertys: any;
    data: any;
    panel?: string;
    setTo?: selector;
    appendTo?: string;
    message?: string;
    log?: string;
}
