import { Store } from "./store.js";
export declare class UserInfo {
    auth: boolean;
    user: string;
    roles: string[];
}
export declare class OutputInfo {
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
    constructor(info: any);
}
export declare class InfoElement {
    id?: string;
    mode?: string;
    type?: string;
    appendTo?: string;
    setPanel?: string;
    element?: string;
    source?: string;
    name?: string;
    method?: string;
    eparams?: object[];
    constructor(info: any);
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
export declare abstract class Element {
    abstract setStore(store: Store): void;
    abstract init(store: InfoElement): void;
    abstract evalMethod(method: string): void;
    abstract getResponse(): any;
}
export declare abstract class AppElement extends Element implements IElementAdmin {
    abstract getElements(): InfoElement[];
}
