import { IConnectInfo } from "../dataModel.js";
export declare abstract class DB {
    abstract connect(info: IConnectInfo): any;
    abstract close(): any;
}
export declare enum RecordMode {
    NONE = 0,
    INSERT = 1,
    UPDATE = 2,
    DELETE = 3,
    UPSERT = 4
}
export interface IFieldInfo {
    cat: string;
    db: string;
    table: string;
    field: string;
    serial: boolean;
    primaryKey: boolean;
    unique: boolean;
    pos: number;
    notNull: boolean;
    type: string;
    length: number;
    decimals: number;
}
export interface IRecordInfo {
    table?: string;
    key?: string[];
    unique?: string[];
    serial?: string;
    data?: {};
    record?: {};
}
export interface QueryResult {
    type?: string;
    lastId?: any;
    rows?: any;
    info?: any;
    error?: any;
    errno?: any;
    table?: string;
    fields?: IFieldInfo[];
}
export interface STMTResult {
    type?: string;
    lastId?: any;
    row?: any;
    info?: any;
    error?: any;
    errno?: any;
    table?: string;
}
export interface IRecordAdmin {
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}
export declare abstract class STMT {
    abstract query(...args: any): any;
    abstract execute(...args: any): any;
}
export declare abstract class DBSql implements IRecordAdmin {
    abstract connect(info: IConnectInfo): any;
    abstract query(sql: string, params?: any[]): Promise<QueryResult>;
    abstract infoQuery(q: string): Promise<IFieldInfo[]>;
    abstract infoTable(table: string): Promise<IFieldInfo[]>;
    abstract prepare(): Promise<STMT>;
    abstract begin(): any;
    abstract commit(): any;
    abstract rollback(): any;
    abstract close(): any;
    abstract insertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract updateRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}
export declare abstract class DBSqll {
    abstract query(q: string): any;
}
