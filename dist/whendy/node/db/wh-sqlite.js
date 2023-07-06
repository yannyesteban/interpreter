var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sqlite3 from "sqlite3";
import { DB } from "./db.js";
export class WhSQLite extends DB {
    connect(info) {
        this.db = new sqlite3.Database(info.dbase);
    }
    execute(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, function (error) {
                if (error) {
                    reject(error);
                }
                resolve(this);
            });
        });
    }
    query(sql, options) {
        throw new Error('Method not implemented.');
    }
    getData(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sql, param, (err, rows) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }));
            });
        });
    }
    getRecord(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.get(sql, param, (err, row) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                }));
            });
        });
    }
    run(sql, data, options) {
        const stmt = this.db.run(sql, ...data);
    }
    close() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=wh-sqlite.js.map