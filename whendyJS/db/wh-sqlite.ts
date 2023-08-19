import sqlite3 from "sqlite3";
import { IConnectInfo, ISQLDBase } from "../dataModel.js";
import { DB } from "./db.js";

export class WhSQLite extends DB implements ISQLDBase {
    db: sqlite3.Database;

    connect(info: IConnectInfo) {
        this.db = new sqlite3.Database(info.dbase);
    }

    execute(sql: string, param?: string[]) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, function (error) {
                if (error) {
                    reject(error);
                }
                resolve(this);
            });
        });
    }

    query(sql: string, options: object) {
        throw new Error("Method not implemented.");
    }

    getData(sql: string, param?: any[]) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sql, param, async (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }

    getRecord(sql: string, param?: any[]) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.get(sql, param, async (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
            });
        });
    }

    run(sql: string, data: any, options: object) {
        const stmt = this.db.run(sql, ...data);
    }

    close() {
        throw new Error("Method not implemented.");
    }
}
