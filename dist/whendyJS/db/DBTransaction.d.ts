import { RecordMode } from "./db.js";
import { DBAdmin } from "./dbAdmin.js";
export interface IFieldInfo {
    field?: string;
    name?: string;
    type?: string;
    key?: boolean;
    serial?: boolean;
    notNull?: boolean;
    default?: string | number | boolean;
    value?: string | number | boolean;
    modifiers?: string[];
    aux?: boolean;
    masterValue?: string;
    inputValue?: string;
    noUpdate?: boolean;
}
export interface ISchemeInfo {
    name?: string;
    table?: string;
    keys?: string[];
    fields?: IFieldInfo[];
}
export interface IDataInfo {
    scheme?: string;
    mode?: RecordMode;
    record?: {};
    data?: {};
    detail?: IDataInfo[];
}
export interface DBSaveInfo {
    db?: string;
    transaction?: boolean;
    schemes?: ISchemeInfo[];
    dataset?: IDataInfo[];
    masterData?: {};
}
export declare class DBTransaction {
    connection: any;
    transaction: any;
    private dbAdmin;
    private db;
    private config;
    private schemes;
    constructor(config: DBSaveInfo, dbAdmin: DBAdmin);
    save(dataset: IDataInfo[], master?: {}): Promise<void>;
}
