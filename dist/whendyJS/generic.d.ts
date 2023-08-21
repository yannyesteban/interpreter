import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
export declare class Generic extends Element {
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): void;
    getResponse(): object[];
}
