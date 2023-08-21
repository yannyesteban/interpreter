import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
export declare class Fragment extends Element {
    id: string;
    name: string;
    element: string;
    className: string | string[];
    setPanel: string;
    appendTo: string;
    templateFile: string;
    response: object;
    store: Store;
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): void;
    load(str: any): void;
    getResponse(): any;
    addResponse(response: any): void;
}
