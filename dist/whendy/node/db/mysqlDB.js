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
import * as mysql from "mysql";
export class MysqlDB extends DBSql {
    query(sql, param) {
        return new Promise((resolve, reject) => {
            this.client.query(sql, param, function (error, results, fields) {
                if (error) {
                    resolve({
                        errno: 0,
                        error: null,
                        rows: results,
                        fields
                    });
                }
                else {
                    resolve({
                        errno: 0,
                        error: null,
                        rows: results,
                        fields
                    });
                }
            });
        });
    }
    infoQuery(q) {
        throw new Error("Method not implemented.");
    }
    infoTable(table, dbase) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield this.query(`SELECT
                TABLE_CATALOG as 'cat', TABLE_SCHEMA as db, TABLE_NAME as 'table', COLUMN_NAME as 'field', ORDINAL_POSITION as 'pos', IS_NULLABLE as 'null', DATA_TYPE as  'type',
                 CHARACTER_MAXIMUM_LENGTH as length, NUMERIC_PRECISION as 'numeric', NUMERIC_SCALE as 'decimal',
                 COLUMN_KEY as 'key', EXTRA as extra
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY pos;`, [dbase || this.dbase, table]);
            return rows.map(row => {
                const { type, length, numeric, decimal } = this.evalType(row);
                return {
                    cat: row.cat,
                    db: row.db,
                    table: row.table,
                    field: row.field,
                    serial: row.extra === "auto_increment" ? true : false,
                    primaryKey: row.key === "PRI" ? true : false,
                    unique: row.key === "UNI" ? true : false,
                    pos: row.pos,
                    notNull: (row.null === "NO") ? true : false,
                    type,
                    length,
                    numeric,
                    decimal
                };
            });
        });
    }
    evalType(row) {
        let type = row.type;
        let length = +row.length;
        let numeric = +row.numeric;
        let decimal = +row.decimal;
        switch (type) {
            //case "int":
            //case "bigint":
            //case "tinyint":
            case "int":
            case "1": //TINY
            case "2": //SHORT
            case "3": //LONG
            case "8": //LONGLONG
            case "9": //INT24
                length = numeric;
                type = "I";
                break;
            case "date":
            case "10": //DATE
            case "12": //DATETIME
                length = 10;
                type = "D";
                break;
            case "datetime":
            case "timestamp":
            case "7": //TIMESTAMP
                type = "S";
                break;
            case "decimal":
            case "real":
            case "float":
            case "numeric":
            case "double":
            case "246": //DECIMAL
            case "4": //FLOAT
            case "5": //DOUBLE
                length = numeric + decimal;
                type = "R";
                break;
            case "time":
            case "11": //TIME
                length = 8;
                type = "T";
                break;
            case "char":
                type = "CH";
                break;
            case "varchar":
            case "253": //VAR_STRING
            case "254": //STRING
                type = "C";
                break;
            case "text":
            case "249": //TINY_BLOB
            case "250": //MEDIUM_BLOB 
            case "251": //LONG_BLOB
            case "252": //BLOB
                type = "B";
                break;
        }
        return { type, length, numeric, decimal };
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
    connect(info) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase,
        });
        this.dbase = info.dbase;
        this.client.connect();
    }
    close() {
        throw new Error("Method not implemented.");
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
            let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(",")});`;
            console.log(query);
            this.client.query(query, values, function (err, rows, fields) {
                if (err) {
                    resolve({
                        row: null,
                        errno: err.errno,
                        error: err.sqlMessage,
                        lastId: null
                    });
                }
                data[info.serial] = rows === null || rows === void 0 ? void 0 : rows.insertId;
                resolve({
                    row: data,
                    errno: 0,
                    error: "",
                    lastId: (rows === null || rows === void 0 ? void 0 : rows.insertId) || null
                });
            });
        });
    }
    upsertRecord(info) {
        return new Promise((resolve) => {
            const data = info.data;
            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }
            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = "?".repeat(fields.length).split("");
            const update = fields.map((field) => `\`${field}\`=new.` + field);
            let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(",")}) AS new ON DUPLICATE KEY UPDATE ${update};`;
            console.log(query);
            this.client.query(query, values, function (err, rows, fields) {
                if (err) {
                    resolve({
                        row: null,
                        errno: err.errno,
                        error: err.sqlMessage,
                        lastId: null
                    });
                }
                data[info.serial] = rows.insertId;
                resolve({
                    row: data,
                    errno: 0,
                    error: "",
                    lastId: rows.insertId
                });
            });
        });
    }
    updateRecord(info) {
        return new Promise((resolve, reject) => {
            const data = info.data;
            const record = info.record;
            const fields = Object.keys(data);
            const values = Object.values(data);
            //const wildcard = "?".repeat(fields.length).split("").join(",");
            const update = fields.map((field) => `\`${field}\`=?`);
            const fields1 = Object.keys(record);
            const values1 = Object.values(record);
            const where = fields1.map((field) => `\`${field}\`=?`).join(" AND ");
            let query = `UPDATE \`${info.table}\` SET ${update} WHERE ${where};`;
            console.log(query);
            this.client.query(query, [...values, ...values1], (err, rows, fields) => {
                if (err) {
                    resolve({
                        row: null,
                        errno: err.errno,
                        error: err.sqlMessage,
                        lastId: null
                    });
                }
                resolve({
                    row: data,
                    errno: 0,
                    error: "",
                    lastId: null
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
            const where = fields.map((field) => `\`${field}\`=?`).join(" AND ");
            console.log("doDelete ->", fields, values);
            let query = `DELETE FROM \`${info.table}\` WHERE ${where};`;
            console.log(query);
            this.client.query(query, values, function (err, rows, fields) {
                if (err) {
                    resolve({
                        row: null,
                        errno: err.errno,
                        error: err.sqlMessage,
                        lastId: null
                    });
                }
                resolve({
                    row: null,
                    errno: 0,
                    error: "",
                    lastId: null
                });
            });
        });
    }
}
//# sourceMappingURL=mysqlDB.js.map