import { DBSql, IFieldInfo, IRecordInfo, STMT, STMTResult } from "./db.js";
import { IConnectInfo } from "../dataModel.js";
export declare class PostgreDB extends DBSql {
    client: any;
    query(sql: string, param?: any[]): Promise<any>;
    infoQuery(q: string): Promise<IFieldInfo[]>;
    infoTable(table: string): Promise<IFieldInfo[]>;
    prepare(): Promise<STMT>;
    begin(): void;
    commit(): void;
    rollback(): void;
    close(): void;
    connect(info: IConnectInfo): void;
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}
