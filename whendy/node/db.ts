import { IConnectInfo, ISQLDBase } from "./dataModel.js"
import { WhSQLite } from "./wh-sqlite.js";
import pg from "pg"
import * as mysql from "mysql"
export interface IRecordId {
    name: string;
    value: any;
}
export interface STMTResult {
    type?;
    lastId?;
    rows?;
    info?;
    error?;
    errno?;
}

export class DBAdmin {
    dbs: { [key: string]: ISQLDBase } = {}

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
        return
    }

    doUpdate(table, data, key): STMTResult {
        return
    }

    doDelete(table, data, key): STMTResult {
        return
    }

    doInsertOrUpdate(table, data): STMTResult {
        return
    }

    begin() {

    }

    commit() {

    }
}

export class SQLiteDB {
    client;

    constructor(info: IConnectInfo) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase
        });
        this.client.connect();
    }

    doInsert(table, data): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("").join(",");

        console.log("data ->", fields, values)
        let query = `INSERT INTO \`${table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard});`

        console.log(query)

        this.client.query(query, values, function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }

    doInsertOrUpdate(table, data): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map(field => `\`${field}\`=new.` + field);

        console.log("data ->", fields, values)
        let query = `INSERT INTO \`${table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard}) AS new
        ON DUPLICATE KEY UPDATE ${update};`

        console.log(query)

        this.client.query(query, values, function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }

    doUpdate(table, data, record): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map(field => `\`${field}\`=?`);

        const fields1 = Object.keys(record);
        const values1 = Object.values(record);


        const where = fields1.map(field => `\`${field}\`=?`).join(" AND");

        console.log("data ->", fields, values)
        let query = `UPDATE \`${table}\` SET ${update} WHERE ${where};`

        console.log(query)

        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }


    doDelete(table, record): STMTResult {


        console.log("doDelete ->", record)
        const fields = Object.keys(record);
        const values = Object.values(record);


        const where = fields.map(field => `\`${field}\`=?`).join(" AND ");

        console.log("doDelete ->", fields, values)
        let query = `DELETE FROM \`${table}\` WHERE ${where};`

        console.log(query)

        const res = /*await*/ this.client.query(query, values,
            function (err, result) {
                if (err) {
                    //handle error
                    console.log("Error ONDELETE", query, err);
                }
                else {
                    console.log(result.rows);
                }
            });


        return
    }

}

export class MysqlDB {
    client;

    constructor(info: IConnectInfo) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase
        });
        this.client.connect();
    }

    doInsert(table, data): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("").join(",");

        console.log("data ->", fields, values)
        let query = `INSERT INTO \`${table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard});`

        console.log(query)

        this.client.query(query, values, function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }

    doInsertOrUpdate(table, data): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map(field => `\`${field}\`=new.` + field);

        console.log("data ->", fields, values)
        let query = `INSERT INTO \`${table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard}) AS new
        ON DUPLICATE KEY UPDATE ${update};`

        console.log(query)

        this.client.query(query, values, function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }

    doUpdate(table, data, record): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map(field => `\`${field}\`=?`);

        const fields1 = Object.keys(record);
        const values1 = Object.values(record);


        const where = fields1.map(field => `\`${field}\`=?`).join(" AND");

        console.log("data ->", fields, values)
        let query = `UPDATE \`${table}\` SET ${update} WHERE ${where};`

        console.log(query)

        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }


    doDelete(table, record): STMTResult {


        console.log("doDelete ->", record)
        const fields = Object.keys(record);
        const values = Object.values(record);


        const where = fields.map(field => `\`${field}\`=?`).join(" AND ");

        console.log("doDelete ->", fields, values)
        let query = `DELETE FROM \`${table}\` WHERE ${where};`

        console.log(query)

        const res = /*await*/ this.client.query(query, values,
            function (err, result) {
                if (err) {
                    //handle error
                    console.log("Error ONDELETE", query, err);
                }
                else {
                    console.log(result.rows);
                }
            });


        return
    }

}


export class PostgreDB {
    client;

    constructor(info: IConnectInfo) {

        this.client = new pg.Client({
            user: info.user,
            host: info.host,
            database: info.dbase,
            password: info.pass,
            port: +(info.port || 5432),
        })
        console.log("8888")
        this.client.connect()

    }

    doInsert(table, data): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1)).join(",");

        console.log("data ->", fields, values, wildcard)
        let query = `INSERT INTO "${table}" ("${fields.join('","')}") VALUES (${wildcard}) RETURNING *;`

        console.log(query)

        const res = /*await*/ this.client.query(query, values,
            function (err, result) {
                if (err) {
                    //handle error
                }
                else {
                    console.log(result.rows);
                }
            });


        return
    }

    doInsertOrUpdate(table, data): STMTResult {




        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1)).join(",");
        const update = fields.map(field => `"${field}"=EXCLUDED.` + field);

        console.log("data ->", fields, values)
        let query = `INSERT INTO "${table}" ("${fields.join("\",\"")}") VALUES (${wildcard}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`



        console.log(query, values)
        const res = /*await*/ this.client.query(query, values,
            function (err, result) {
                if (err) {
                    console.log("err", err)
                    //handle error
                }
                else {
                    console.log("ALL ", result, "ROWS", result.rows);
                }
                return
            });



        return
    }

    doUpdate(table, data, record): STMTResult {

        console.log("data ->", data)
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index+1}`);

        const fields1 = Object.keys(record);
        const values1 = Object.values(record);


        const where = fields1.map(field => `"${field}"=$${fields.length+1}`).join(" AND");

        console.log("data ->", fields, values)
        let query = `UPDATE "${table}" SET ${update} WHERE ${where};`

        console.log(query)

        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]);
            console.log(rows, fields)
        });
        return
    }

    doDelete(table, record): STMTResult {


        console.log("doDelete ->", record)
        const fields = Object.keys(record);
        const values = Object.values(record);


        const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");

        console.log("doDelete ->", fields, values)
        console.log("Where  ->", where, `--${where}--`)
        let query = `DELETE FROM "${table}" WHERE ${where};`

        console.log(query)

        const res = /*await*/ this.client.query(query, values,
            function (err, result) {
                if (err) {
                    //handle error
                    console.log("Error ONDELETE", query, err);
                }
                else {
                    console.log(result.rows);
                }
            });


        return
    }


}


