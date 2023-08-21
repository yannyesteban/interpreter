import sqlite3 from "sqlite3";
import { IConnectInfo, ISQLDBase } from "../dataModel.js";
import { DB } from "./db.js";
export declare class WhSQLite extends DB implements ISQLDBase {
    db: sqlite3.Database;
    connect(info: IConnectInfo): void;
    execute(sql: string, param?: string[]): Promise<unknown>;
    query(sql: string, options: object): void;
    getData(sql: string, param?: any[]): Promise<unknown>;
    getRecord(sql: string, param?: any[]): Promise<unknown>;
    run(sql: string, data: any, options: object): void;
    close(): void;
}
