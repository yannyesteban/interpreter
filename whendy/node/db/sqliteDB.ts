import { IConnectInfo } from "../dataModel.js";
import { DBSql, IFieldInfo, IRecordAdmin, IRecordInfo, STMT, STMTResult } from "./db.js";
import * as mysql from "mysql";
import sqlite3 from "sqlite3";
export class SQLiteDB extends DBSql {
    
    query(sql: string, param?: any[]) {
        sql = sql.replace(/`/igm, '"');

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sql, param, async (error: any, rows) => {
                    
                    if (error) {
                        resolve({
                            rows: null,
                            errno: error.errno,
                            error: error.message,
                        });
                    } else {
                        resolve({
                            errno: 0,
                            error: null,
                            rows: rows
                        });
                    }
                })
            });
        });
    }
    infoQuery(q: string):Promise<IFieldInfo[]> {
        throw new Error("Method not implemented.");
    }
    infoTable(table: string):Promise<IFieldInfo[]> {
        throw new Error("Method not implemented.");
    }
    prepare(): Promise<STMT> {
        throw new Error("Method not implemented.");
    }
    begin() {
        throw new Error("Method not implemented.");
    }
    commit() {
        throw new Error("Method not implemented.");
    }
    rollback() {
        throw new Error("Method not implemented.");
    }
    close() {
        throw new Error("Method not implemented.");
    }
    client;

    db: sqlite3.Database;

    connect(info: IConnectInfo) {
        this.db = new sqlite3.Database(info.dbase);

    }



    insertRecord(info: IRecordInfo): Promise<STMTResult> {
        return new Promise((resolve, reject) => {

            const data = info.data;
            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }

            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = "?".repeat(fields.length).split("");

            let query = `INSERT INTO "${info.table}" ("${fields.join(
                '","'
            )}") VALUES (${wildcard.join(",")}) RETURNING *;`;

            console.log(query);
            this.db.serialize(() => {
                this.db.get(query, values, function (err: any, result) {
                    console.log(`Row(s) updated: ${this["changes"]}`);
                    if (err) {

                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null
                        });

                    } else {

                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: result[info.serial]

                        });
                    }
                }
                );
            });

        });

    }

    updateRecord(info: IRecordInfo): Promise<STMTResult> {
        return new Promise((resolve, reject) => {
            const data = info.data;
            const record = info.record;
            console.log("data ->", data);
            const fields = Object.keys(data);
            const values = Object.values(data);
            //const wildcard = "?".repeat(fields.length).split("").join(",");
            //const update = fields.map((field, index) => `"${field}"=$${index + 1}`);
            const update = fields.map((field, index) => `"${field}"=?`);
            const fields1 = Object.keys(record);
            const values1 = Object.values(record);

            const where = fields1
                //.map((field) => `"${field}"=$${fields.length + 1}`)
                .map((field) => `"${field}"=?`)
                .join(" AND ");


            let query = `UPDATE "${info.table}" SET ${update} WHERE ${where} RETURNING *;`;

            console.log(query);

            this.db.serialize(() => {
                this.db.get(query, [...values, ...values1], (err: any, result) => {

                    if (err) {

                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null
                        });

                    } else {

                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: null

                        });
                    }
                });
            });
        });
    }

    upsertRecord(info: IRecordInfo): Promise<STMTResult> {
        return new Promise((resolve, reject) => {
            const data = info.data;

            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }

            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = fields.map((f, index) => "$" + (index + 1));
            const update = fields.map((field) => `"${field}"=EXCLUDED.` + field);

            let query = `INSERT INTO "${info.table}" ("${fields.join(
                '","'
            )}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;

            console.log(query);
            this.db.serialize(() => {
                this.db.get(query, values, (err: any, result) => {

                    if (err) {

                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null
                        });

                    } else {

                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: null

                        });
                    }
                });
            });

        });
    }

    deleteRecord(info: IRecordInfo): Promise<STMTResult> {
        return new Promise((resolve, reject) => {
            const record = info.record;
            console.log("doDelete ->", record);
            const fields = Object.keys(record);
            const values = Object.values(record);

            const where = fields
                .map((field, index) => `"${field}"=$${index + 1}`)
                .join(" AND ");

            console.log("doDelete ->", fields, values);
            console.log("Where  ->", where, `--${where}--`);
            let query = `DELETE FROM "${info.table}" WHERE ${where};`;

            console.log(query);

            this.db.serialize(() => {
                this.db.get(query, values, function (err: any, result) {
                    console.log(`Row(s) updated: ${this["changes"]}`);
                    if (err) {

                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null
                        });

                    } else {

                        resolve({
                            row: null,
                            errno: 0,
                            error: "",
                            lastId: null

                        });
                    }
                }
                );
            });
        });
    }
}