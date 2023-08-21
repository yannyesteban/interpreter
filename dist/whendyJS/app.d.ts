import { InfoElement, AppElement } from "./element.js";
import { Store } from "./store.js";
export declare const externConfig = true;
export declare class App extends AppElement {
    id: string;
    name: string;
    element: string;
    className: string | string[];
    modules: object[];
    jsModules: object[];
    templateFile: string;
    cssSheets: string[];
    elements: InfoElement[];
    store: Store;
    eparams: any;
    private response;
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): void;
    load(): void;
    getElements(): InfoElement[];
    getResponse(): any;
    addResponse(response: any): void;
}
