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
    rows?: any[];
    info?;
    error?;
    errno?;
    table?: string;
    fields?: IFieldInfo[];
    totalRecords?: number;
    page?: number;
    totalPages?: number;
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

export type BDRequest = {
    sql?: string;
    filterBy?: string[];
    filter?: string;
    params?: string[];
    select?: any[];
    from?: string;
    join?: any[];
    where?: any;
    orderBy?: string[];
    limit?: number;
    page?: number;
    offset?: number;
    record?: any;
};

export abstract class DBEngine implements IRecordAdmin {
    abstract connect(info: IConnectInfo): void;
    abstract query(sql: string | object, params?: any[]): Promise<QueryResult>;
    abstract infoQuery(q: string): Promise<IFieldInfo[]>;
    abstract infoTable(table: string): Promise<IFieldInfo[]>;
    abstract prepare(): Promise<STMT>;
    abstract begin(): void;
    abstract commit(): void;
    abstract rollback(): void;
    abstract close(): void;
    abstract insertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract updateRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    abstract deleteRecord(info: IRecordInfo): Promise<STMTResult>;

    abstract doQueryAll(query: string): string;

    abstract getRecord(info:BDRequest, key:any): Promise<any>
}

export abstract class DBSqll {
    abstract query(q: string);
}
