export type selector = string;
export interface AppComponent {
    valid?: () => boolean;
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
    validate?: AppComponent | selector | HTMLElement | (() => boolean);
    form?: selector | HTMLElement | HTMLFormElement;
    body?: object;
    headers?: {
        [key: string]: string;
    };
    actions?: AppAction[];
    store?: true | {
        [key: string]: any;
    };
    reportValidity?: boolean;
    blockLayers?: selector[];
    blockForm?: boolean;
}
export interface HtmlFragment {
}
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
    data?: any;
}
export interface IForm {
    getValues(): any;
    isValid(arg?: any): boolean;
}
export interface FetchInfo {
    method?: string;
    mode?: string;
    headers?: any;
    body?: any;
}
export interface RequestInfo {
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
