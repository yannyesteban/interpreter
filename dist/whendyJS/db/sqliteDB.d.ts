import { IConnectInfo } from "../dataModel.js";
import { DBSql, IFieldInfo, IRecordInfo, STMT, STMTResult } from "./db.js";
import sqlite3 from "sqlite3";
export declare class SQLiteDB extends DBSql {
    query(sql: string, param?: any[]): Promise<unknown>;
    infoQuery(q: string): Promise<IFieldInfo[]>;
    infoTable(table: string): Promise<IFieldInfo[]>;
    prepare(): Promise<STMT>;
    begin(): void;
    commit(): void;
    rollback(): void;
    close(): void;
    client: any;
    db: sqlite3.Database;
    connect(info: IConnectInfo): void;
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}
