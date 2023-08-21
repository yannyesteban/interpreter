import { IConnectInfo } from "../dataModel.js";
import { DBSql, IFieldInfo, IRecordInfo, QueryResult, STMT, STMTResult } from "./db.js";
export declare class MysqlDB extends DBSql {
    client: any;
    dbase: string;
    query(sql: string, param?: any[]): Promise<QueryResult>;
    infoQuery(q: string): Promise<IFieldInfo[]>;
    infoTable(table: string, dbase?: string): Promise<IFieldInfo[]>;
    evalFlags(flags: any): {
        serial: boolean;
        unique: boolean;
        notNull: boolean;
        primaryKey: boolean;
    };
    evalType(row: any): any;
    prepare(): Promise<STMT>;
    begin(): void;
    commit(): void;
    rollback(): void;
    connect(info: IConnectInfo): void;
    close(): void;
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}
