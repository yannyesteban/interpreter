import { Store } from "./store.js";

export class UserInfo {
    auth: boolean;
    user: string;
    roles: string[];
}

export interface IResponse {
    do?: string;
    to?: string;
    id?: string;

    element?: string;
    propertys?: any;
    api?: string;
    name?: string;
    method?: string;
    params?: any;
    message?: string;
    error?: string;
    log?: any;
}

export class OutputInfo {
    info?: any;
    dinamic?: boolean;
    type?: string;
    data?: any;
    id?: string;
    name?: string;
    mode?: string;
    method?: string;
    appendTo?: string;
    setPanel?: string;
    element?: string;
    props?: object;

    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
}

export class InfoElement {
    do?: string; //set-panel, set-element, update, append-to, before-to, request, request-to, DATA?
    to?: string; // panel1, #id-element, function-to
    panel?: string;
    id?: string;
    //mode?:string;
    //type?: string;
    appendTo?: string;
    //setPanel?: string;
    api?: string;
    //source?: string;
    name?: string;
    method?: string;
    params?: object[];
    doWhen?: any;

    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
}

export interface IElementAdmin {
    getElements(): InfoElement[];
}

export interface IRestElement {
    getRestData(): any;
}

export interface IUserAdmin {
    getUserInfo(): UserInfo;
}

export abstract class Element {
    private _response: IResponse;
    abstract setStore(store: Store): void;
    abstract init(store: InfoElement): void;
    abstract evalMethod(method: string): void;
    getResponse(): IResponse {
        return this._response;
    }

    doResponse(response: IResponse) {
        this._response = response;
    }
}

export abstract class AppElement extends Element implements IElementAdmin {
    abstract getElements(): InfoElement[];
}
