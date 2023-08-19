var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DBSql } from "./db.js";
import sqlite3 from "sqlite3";
export class SQLiteDB extends DBSql {
    query(sql, param) {
        sql = sql.replace(/`/gim, '"');
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sql, param, (error, rows) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        resolve({
                            rows: null,
                            errno: error.errno,
                            error: error.message,
                        });
                    }
                    else {
                        resolve({
                            errno: 0,
                            error: null,
                            rows: rows,
                        });
                    }
                }));
            });
        });
    }
    infoQuery(q) {
        throw new Error("Method not implemented.");
    }
    infoTable(table) {
        throw new Error("Method not implemented.");
    }
    prepare() {
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
    connect(info) {
        this.db = new sqlite3.Database(info.dbase);
    }
    insertRecord(info) {
        return new Promise((resolve, reject) => {
            const data = info.data;
            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }
            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = "?".repeat(fields.length).split("");
            let query = `INSERT INTO "${info.table}" ("${fields.join('","')}") VALUES (${wildcard.join(",")}) RETURNING *;`;
            console.log(query);
            this.db.serialize(() => {
                this.db.get(query, values, function (err, result) {
                    console.log(`Row(s) updated: ${this["changes"]}`);
                    if (err) {
                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null,
                        });
                    }
                    else {
                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: result[info.serial],
                        });
                    }
                });
            });
        });
    }
    updateRecord(info) {
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
                this.db.get(query, [...values, ...values1], (err, result) => {
                    if (err) {
                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null,
                        });
                    }
                    else {
                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: null,
                        });
                    }
                });
            });
        });
    }
    upsertRecord(info) {
        return new Promise((resolve, reject) => {
            const data = info.data;
            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }
            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = fields.map((f, index) => "$" + (index + 1));
            const update = fields.map((field) => `"${field}"=EXCLUDED.` + field);
            let query = `INSERT INTO "${info.table}" ("${fields.join('","')}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;
            console.log(query);
            this.db.serialize(() => {
                this.db.get(query, values, (err, result) => {
                    if (err) {
                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null,
                        });
                    }
                    else {
                        resolve({
                            row: result,
                            errno: 0,
                            error: "",
                            lastId: null,
                        });
                    }
                });
            });
        });
    }
    deleteRecord(info) {
        return new Promise((resolve, reject) => {
            const record = info.record;
            console.log("doDelete ->", record);
            const fields = Object.keys(record);
            const values = Object.values(record);
            const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");
            console.log("doDelete ->", fields, values);
            console.log("Where  ->", where, `--${where}--`);
            let query = `DELETE FROM "${info.table}" WHERE ${where};`;
            console.log(query);
            this.db.serialize(() => {
                this.db.get(query, values, function (err, result) {
                    console.log(`Row(s) updated: ${this["changes"]}`);
                    if (err) {
                        resolve({
                            row: null,
                            errno: err.errno,
                            error: err.message,
                            lastId: null,
                        });
                    }
                    else {
                        resolve({
                            row: null,
                            errno: 0,
                            error: "",
                            lastId: null,
                        });
                    }
                });
            });
        });
    }
}
//# sourceMappingURL=sqliteDB.js.map