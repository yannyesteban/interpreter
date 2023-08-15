import { IConnectInfo, ISQLDBase } from "../dataModel.js";
import { WhSQLite } from "./wh-sqlite.js";

export abstract class DB {
    abstract connect(info: IConnectInfo);
    abstract close();
}

export enum RecordMode {
    NONE = 0,
    INSERT = 1,
    UPDATE,
    DELETE,
    UPSERT,
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
    //sqlData?: {};
    record?: {};
    //infoQuery?:string;
}

export interface QueryResult {
    type?: string;
    lastId?;
    rows?;
    info?;
    error?;
    errno?;
    table?: string;
    fields?: IFieldInfo[];
}

export interface STMTResult {
    type?: string;
    lastId?;
    row?;
    info?;
    error?;
    errno?;
    table?: string;
}

export interface IRecordAdmin {
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}

export abstract class STMT {
    abstract query(...args: any);
    abstract execute(...args: any);
}

export abstract class DBSql implements IRecordAdmin {
    abstract connect(info: IConnectInfo);
    abstract query(sql: string, params?: any[]): Promise<QueryResult>;
    abstract infoQuery(q: string):Promise<IFieldInfo[]>;
    abstract infoTable(table: string):Promise<IFieldInfo[]>;
    abstract prepare(): Promise<STMT>;
    abstract begin();
    abstract commit();
    abstract rollback();
    abstract close();
    abstract insertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract updateRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}

export abstract class DBSqll {
    abstract query(q: string);
}
