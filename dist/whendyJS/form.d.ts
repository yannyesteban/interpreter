import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
export declare class Model {
    name: string;
    mode: string;
    response: any;
}
export declare class Form extends Element {
    id: string;
    name: string;
    element: string;
    className: string | string[];
    setPanel: string;
    appendTo: string;
    templateFile: string;
    response: object;
    store: Store;
    private query;
    private db;
    private connection;
    private _info;
    private fields;
    private layout;
    data: any;
    datafields: any;
    dataFetch: any;
    dataLists: any;
    _data: any;
    eparams: any;
    record: any;
    mode: any;
    scheme: any;
    private keyToken;
    dataRecord: any;
    recordKey: any;
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): Promise<void>;
    load(): Promise<void>;
    getDataRecord(info: any): Promise<any>;
    find(): Promise<void>;
    transaction(): Promise<void>;
    getDataFields(list: any): Promise<any[]>;
    getDataField(info: any): Promise<{
        name: any;
        data: any[];
        childs: any;
        parent: any;
        mode: any;
    }>;
    doDataFields(parent: any): Promise<void>;
    getResponse(): any;
    addResponse(response: any): void;
    evalDataFields(dataFields: any): Promise<{}>;
    evalData(dataField: any): Promise<any[]>;
    private evalFields;
}
