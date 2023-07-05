import { IConnectInfo, ISQLDBase } from "./dataModel.js";
import { WhSQLite } from "./wh-sqlite.js";
import pg from "pg";
import * as mysql from "mysql";

export enum RecordMode {
    NONE = 0,
    INSERT = 1,
    UPDATE,
    DELETE,
    UPSERT,
};

export interface IRecordInfo {
    table?: string;
    key?: string[];
    unique?: string[];
    serial?: string;
    data?: {};
    //sqlData?: {};
    record?: {};
    //infoQuery?:string;
}


export interface STMTResult {
    type?: string;
    lastId?;
    row?;
    info?;
    error?;
    errno?;
    table?: string;
}

export interface IDBAdmin {
    insertRecord(info: IRecordInfo): Promise<STMTResult>;
    updateRecord(info: IRecordInfo): Promise<STMTResult>;
    upsertRecord(info: IRecordInfo): Promise<STMTResult>;
    deleteRecord(info: IRecordInfo): Promise<STMTResult>;
}

export class DBAdmin {
    dbs: { [key: string]: ISQLDBase } = {};

    init(data: IConnectInfo[]) {
        for (let info of data) {
            switch (info.driver) {
                case "sqlite":
                    this.dbs[info.name] = new WhSQLite();
                    this.dbs[info.name].connect(info);
            }
        }
    }

    get(name: string): ISQLDBase {
        return this.dbs[name];
    }

    doInsert(table, data): STMTResult {
        return;
    }

    doUpdate(table, data, key): STMTResult {
        return;
    }

    doDelete(table, data, key): STMTResult {
        return;
    }

    doInsertOrUpdate(table, data): STMTResult {
        return;
    }

    begin() { }

    commit() { }
}

export class SQLiteDB {
    client;

    constructor(info: IConnectInfo) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase,
        });
        this.client.connect();
    }

    insertRecord(info: IRecordInfo): Promise<STMTResult> {
        console.log("info ->", info);
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        } else {
            console.log("hello info", info, data);
        }

        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = Object.keys(data).map((f, index) => "$" + (index + 1));

        console.log("data ->", fields, values, wildcard);
        let query = `INSERT INTO "${info.table}" ("${fields.join(
            '","'
        )}") VALUES (${wildcard.join(",")}) RETURNING *;`;

        console.log(query);

        const res = /*await*/ this.client.query(
            query,
            values,
            function (err, result) {
                if (err) {
                    console.log("err ", err);
                    //handle error
                } else {
                    console.log("result.rows:", result.rows);
                }
            }
        );

        return;
    }
    updateRecord(info: IRecordInfo): Promise<STMTResult> {
        const data = info.data;
        const record = info.record;
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index + 1}`);

        const fields1 = Object.keys(record);
        const values1 = Object.values(record);

        const where = fields1
            .map((field) => `"${field}"=$${fields.length + 1}`)
            .join(" AND ");

        console.log("data ->", fields, values);
        let query = `UPDATE "${info.table}" SET ${update} WHERE ${where};`;

        console.log(query);

        this.client.query(
            query,
            [...values, ...values1],
            function (err, rows, fields) {
                if (err) throw err;

                //console.log(rows[0]);
                console.log(rows, fields);
            }
        );
        return;
    }

    upsertRecord(info: IRecordInfo): Promise<STMTResult> {
        const data = info.data;

        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        } else {
            console.log("hello info", info, data);
        }

        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1));
        const update = fields.map((field) => `"${field}"=EXCLUDED.` + field);

        console.log("data ->", fields, values);
        let query = `INSERT INTO "${info.table}" ("${fields.join(
            '","'
        )}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;

        console.log(query, values);
        const res = /*await*/ this.client.query(
            query,
            values,
            function (err, result) {
                if (err) {
                    console.log("err", err);
                    //handle error
                } else {
                    console.log("ALL ", result, "ROWS", result.rows);
                }
                return;
            }
        );

        return;
    }

    deleteRecord(info: IRecordInfo): Promise<STMTResult> {
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

        const res = /*await*/ this.client.query(
            query,
            values,
            function (err, result) {
                if (err) {
                    //handle error
                    console.log("Error ONDELETE", query, err);
                } else {
                    console.log(result.rows);
                }
            }
        );

        return;
    }
}

export class MysqlDB implements IDBAdmin {
    client;

    constructor(info: IConnectInfo) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase,
        });
        this.client.connect();
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

            let query = `INSERT INTO \`${info.table}\` (\`${fields.join(
                "`,`"
            )}\`) VALUES (${wildcard.join(",")});`;

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

    upsertRecord(info: IRecordInfo): Promise<STMTResult> {

        return new Promise((resolve) => {

            const data = info.data;

            if (info.serial !== undefined && !data[info.serial]) {
                delete data[info.serial];
            }

            const fields = Object.keys(data);
            const values = Object.values(data);
            const wildcard = "?".repeat(fields.length).split("");
            const update = fields.map((field) => `\`${field}\`=new.` + field);

            let query = `INSERT INTO \`${info.table}\` (\`${fields.join(
                "`,`"
            )}\`) VALUES (${wildcard.join(",")}) AS new ON DUPLICATE KEY UPDATE ${update};`;

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

    updateRecord(info: IRecordInfo): Promise<STMTResult> {

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

    deleteRecord(info: IRecordInfo): Promise<STMTResult> {

        return new Promise((resolve, reject) => {
            const record = info.record;

            console.log("doDelete ->", record);
            const fields = Object.keys(record);
            const values = Object.values(record);

            const where = fields.map((field) => `\`${field}\`=?`).join(" AND ");

            console.log("doDelete ->", fields, values);
            let query = `DELETE FROM \`${info.table}\` WHERE ${where};`;

            console.log(query);

            this.client.query(
                query,
                values,
                function (err, rows, fields) {
                    if (err) {
                        reject(err)
                    }

                    console.log({ rows, fields })
                    resolve({

                        errno: 0,
                        error: "",
                        lastId: rows.insertId
                    })
                }
            );



        });

    }
}

export class PostgreDB implements IDBAdmin {
    client;

    constructor(info: IConnectInfo) {
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


        let query = `INSERT INTO "${info.table}" ("${fields.join(
            '","'
        )}") VALUES (${wildcard.join(",")}) RETURNING *;`;

        console.log(query);

        return await this.client.query(
            query,
            values
        ).then(result => {
            return {
                type: result.command,
                row: result.rows[0],
                errno: 0,
                error: "",
                lastId: result.rows[0][info.serial]
            }
        }).catch(e => {
            console.log(e)
            return {
                errno: e.code,
                error: e.error
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

        const where = fields1
            .map((field) => `"${field}"=$${fields.length + 1}`)
            .join(" AND ");

        console.log("data ->", fields, values);
        let query = `UPDATE "${info.table}" SET ${update} WHERE ${where};`;

        console.log(query);

        return await this.client.query(
            query,
            [...values, ...values1]
        ).then(result => {
            return {
                type: result.command,
                row: data,
                errno: 0,
                error: "",
                lastId: null
            }
        }).catch(e => {
            console.log(e)
            return {
                errno: e.code,
                error: e.error
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

        let query = `INSERT INTO "${info.table}" ("${fields.join(
            '","'
        )}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;

        console.log(query, values);
        return await this.client.query(
            query,
            values
        ).then(result => {

            return {
                type: result.command,
                row: result.rows[0],
                errno: 0,
                error: "",
                lastId: result.rows[0][info.serial]
            }
        }).catch(e => {

            return {
                errno: e.code,
                error: e.error
            };
        });


    }

    async deleteRecord(info: IRecordInfo): Promise<STMTResult> {

        const record = info.record;
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields
            .map((field, index) => `"${field}"=$${index + 1}`)
            .join(" AND ");

        let query = `DELETE FROM "${info.table}" WHERE ${where};`;

        console.log(query);

        return await this.client.query(
            query,
            values
        ).then(result => {

            return {
                type: result.command,
                row: result.rows[0],
                errno: 0,
                error: "",
                lastId: result.rows[0][info.serial]
            }
        }).catch(e => {
            return {
                errno: e.code,
                error: e.error
            };
        });
    }
}
