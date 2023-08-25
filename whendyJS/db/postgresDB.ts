import { DBSql, IFieldInfo, IRecordAdmin, IRecordInfo, STMT, STMTResult } from "./db.js";
import { IConnectInfo } from "../dataModel.js";
import pg from "pg";

export class PostgreDB extends DBSql {
    client;

    async query(value: string, param?: any[]) {

        let sql: string;
        if (typeof value === "object") {
            sql = this.doQuery(value);
        } else {
            sql = value;
        }

        sql = sql.replace(/`/gim, '"');
        let index = 1;
        sql = sql.replace(/\?/gim, (e) => {
            console.log(e, index);
            return "$" + index.toString();
        });

        return await this.client
            .query(sql, param)
            .then((result) => {
                return {
                    errno: 0,
                    error: null,
                    rows: result.rows,
                };
            })
            .catch((err) => {
                return {
                    errno: err.errno,
                    error: err.error,
                    rows: [],
                };
            });
    }

    infoQuery(q: string): Promise<IFieldInfo[]> {
        throw new Error("Method not implemented.");
    }
    infoTable(table: string): Promise<IFieldInfo[]> {
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

    connect(info: IConnectInfo) {
        this.client = new pg.Client({
            user: info.user,
            host: info.host,
            database: info.dbase,
            password: info.pass,
            port: +(info.port || 5432),
        });

        this.client.connect();
    }

    async insertRecord(info: IRecordInfo): Promise<STMTResult> {
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            delete data[info.serial];
        }

        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = Object.keys(data).map((f, index) => "$" + (index + 1));

        let query = `INSERT INTO "${info.table}" ("${fields.join('","')}") VALUES (${wildcard.join(",")}) RETURNING *;`;

        console.log(query);

        return await this.client
            .query(query, values)
            .then((result) => {
                return {
                    type: result.command,
                    row: result.rows[0],
                    errno: 0,
                    error: "",
                    lastId: result.rows[0][info.serial],
                };
            })
            .catch((e) => {
                console.log(e);
                return {
                    errno: e.code,
                    error: e.error,
                };
            });
    }
    async updateRecord(info: IRecordInfo): Promise<STMTResult> {
        const data = info.data;
        const record = info.record;
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index + 1}`);

        const fields1 = Object.keys(record);
        const values1 = Object.values(record);

        const where = fields1.map((field) => `"${field}"=$${fields.length + 1}`).join(" AND ");

        console.log("data ->", fields, values);
        let query = `UPDATE "${info.table}" SET ${update} WHERE ${where};`;

        console.log(query);

        return await this.client
            .query(query, [...values, ...values1])
            .then((result) => {
                return {
                    type: result.command,
                    row: data,
                    errno: 0,
                    error: "",
                    lastId: null,
                };
            })
            .catch((e) => {
                console.log(e);
                return {
                    errno: e.code,
                    error: e.error,
                };
            });
    }

    async upsertRecord(info: IRecordInfo): Promise<STMTResult> {
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

        console.log(query, values);
        return await this.client
            .query(query, values)
            .then((result) => {
                return {
                    type: result.command,
                    row: result.rows[0],
                    errno: 0,
                    error: "",
                    lastId: result.rows[0][info.serial],
                };
            })
            .catch((e) => {
                return {
                    errno: e.code,
                    error: e.error,
                };
            });
    }

    async deleteRecord(info: IRecordInfo): Promise<STMTResult> {
        const record = info.record;
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");

        let query = `DELETE FROM "${info.table}" WHERE ${where};`;

        console.log(query);

        return await this.client
            .query(query, values)
            .then((result) => {
                return {
                    type: result.command,
                    row: result.rows[0],
                    errno: 0,
                    error: "",
                    lastId: result.rows[0][info.serial],
                };
            })
            .catch((e) => {
                return {
                    errno: e.code,
                    error: e.error,
                };
            });
    }

    doQuery(value):string {
        let query = value.sql;

        if (value.limit) {
            const limit = " LIMIT " + value.limit;

            if (value.pagination) {
                query += limit + " OFFSET " + (value.page - 1) * value.limit;
            }
        }

        return query;
    }

    doQueryAll(query:string):string {
        return query.replace(/(select\s)(.+) FROM\s/i, "$1count(*) as total FROM ");
    }
}
