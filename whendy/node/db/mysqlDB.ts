import { IConnectInfo } from "../dataModel.js";
import { DB, DBSql, IRecordAdmin, IRecordInfo, STMT, STMTResult } from "./db.js";
import * as mysql from "mysql";


export class MysqlDB extends DBSql {
    client;

    query(sql: string, param?: any[]) {
        return new Promise((resolve, reject)=>{
            this.client.query(sql, param, function (error, results, fields) {
                
                if (error) 
                {
                    console.error(sql)
                };
                resolve(results || [])
              });
        });
        
    }
    infoQuery(q: string) {
        throw new Error("Method not implemented.");
    }
    infoTable(table: string) {
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
    
    connect(info: IConnectInfo) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase,
        });
        this.client.connect();
    }
    close() {
        throw new Error("Method not implemented.");
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
                
                data[info.serial] = rows?.insertId;

                resolve({
                    row: data,
                    errno: 0,
                    error: "",
                    lastId: rows?.insertId || null
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
            }
            );



        });

    }
}