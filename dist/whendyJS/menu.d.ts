import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
export declare class Menu extends Element {
    id: string;
    name: string;
    element: string;
    className: string | string[];
    setPanel: string;
    appendTo: string;
    templateFile: string;
    response: object[];
    store: Store;
    _config: any;
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): Promise<void>;
    load(): Promise<void>;
    getResponse(): object[];
    addResponse(response: any): void;
}
