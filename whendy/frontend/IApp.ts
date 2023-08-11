export type selector = string;

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
    headers?: {};
    type?: string;
    panel?: selector;
    confirm?: string;
    valid?: boolean;
    form?: selector | HTMLFormElement;
    body?: object;
    header?: { [key: string]: string };
    actions: AppAction[];
}

export interface HtmlFragment {}

export interface ElementResponse {
    setPanel?: string;
    setTo?: selector;
    appendTo?: selector;
    type?: string;
    id?: string;
    mode?: string;
    element: string;
    props: any;
    attrs: any;
    html: string;
    text: string;
    css: string;
    script: string;
    data?:any;
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
    setPanel?: string;
    setTo?: selector;
    appendTo?: string;
}