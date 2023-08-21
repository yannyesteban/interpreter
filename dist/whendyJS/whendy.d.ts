import { Store } from "./store.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import { ClassManager } from "./classManager.js";
import { Authorization } from "./Authorization.js";
declare enum AppMode {
    START = 1,
    RESTAPI = 2
}
export interface InfoClass {
    name: string;
    enable: boolean;
    file: string;
    class: string;
}
export declare class Whendy {
    store: Store;
    authorization: Authorization;
    private output;
    private restData;
    private mode;
    private appInfo;
    private start;
    classes: ClassManager;
    render(request: any): Promise<string>;
    setStart(info: InfoElement): void;
    setMode(mode: AppMode): void;
    addResponse(response: OutputInfo[]): void;
    evalRequest(requests: []): Promise<void>;
    getElementConfig(element: any, name: any): any;
    setElement(info: InfoElement): Promise<void>;
    doElementAdmin(ele: IElementAdmin | Element): Promise<boolean>;
    doUserAdmin(ele: IUserAdmin | Element): Promise<void>;
    doRestData(ele: IRestElement | Element): void;
    setRestData(data: any): void;
}
export {};
