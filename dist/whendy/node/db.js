import { WhSQLite } from "./wh-sqlite.js";
import pg from "pg";
import * as mysql from "mysql";
var RecorMode;
(function (RecorMode) {
    RecorMode[RecorMode["INSERT"] = 1] = "INSERT";
    RecorMode[RecorMode["UPDATE"] = 2] = "UPDATE";
    RecorMode[RecorMode["DELETE"] = 3] = "DELETE";
    RecorMode[RecorMode["UPSERT"] = 4] = "UPSERT";
})(RecorMode || (RecorMode = {}));
export class DBAdmin {
    constructor() {
        this.dbs = {};
    }
    init(data) {
        for (let info of data) {
            switch (info.driver) {
                case "sqlite":
                    this.dbs[info.name] = new WhSQLite();
                    this.dbs[info.name].connect(info);
            }
        }
    }
    get(name) {
        return this.dbs[name];
    }
    doInsert(table, data) {
        return;
    }
    doUpdate(table, data, key) {
        return;
    }
    doDelete(table, data, key) {
        return;
    }
    doInsertOrUpdate(table, data) {
        return;
    }
    begin() {
    }
    commit() {
    }
}
export class SQLiteDB {
    constructor(info) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase
        });
        this.client.connect();
    }
    insertRecord(info) {
        console.log("info ->", info);
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = Object.keys(data).map((f, index) => "$" + (index + 1));
        console.log("data ->", fields, values, wildcard);
        let query = `INSERT INTO "${info.table}" ("${fields.join('","')}") VALUES (${wildcard.join(",")}) RETURNING *;`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                console.log("err ", err);
                //handle error
            }
            else {
                console.log("result.rows:", result.rows);
            }
        });
        return;
    }
    updateRecord(info) {
        const data = info.data;
        const record = info.record;
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index + 1}`);
        const fields1 = Object.keys(record);
        const values1 = Object.values(record);
        const where = fields1.map(field => `"${field}"=$${fields.length + 1}`).join(" AND ");
        console.log("data ->", fields, values);
        let query = `UPDATE "${info.table}" SET ${update} WHERE ${where};`;
        console.log(query);
        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    upsertRecord(info) {
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1));
        const update = fields.map(field => `"${field}"=EXCLUDED.` + field);
        console.log("data ->", fields, values);
        let query = `INSERT INTO "${info.table}" ("${fields.join("\",\"")}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;
        console.log(query, values);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                console.log("err", err);
                //handle error
            }
            else {
                console.log("ALL ", result, "ROWS", result.rows);
            }
            return;
        });
        return;
    }
    deleteRecord(info) {
        const record = info.record;
        console.log("doDelete ->", record);
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");
        console.log("doDelete ->", fields, values);
        console.log("Where  ->", where, `--${where}--`);
        let query = `DELETE FROM "${info.table}" WHERE ${where};`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                //handle error
                console.log("Error ONDELETE", query, err);
            }
            else {
                console.log(result.rows);
            }
        });
        return;
    }
}
export class MysqlDB {
    constructor(info) {
        this.client = mysql.createConnection({
            host: info.host,
            user: info.user,
            password: info.pass,
            database: info.dbase
        });
        this.client.connect();
    }
    insertRecord(info) {
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("");
        console.log("data ->", fields, values);
        let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(",")});`;
        console.log(query);
        this.client.query(query, values, function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    upsertRecord(info) {
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = "?".repeat(fields.length).split("");
        const update = fields.map(field => `\`${field}\`=new.` + field);
        console.log("data ->", fields, values);
        let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(",")}) AS new
        ON DUPLICATE KEY UPDATE ${update};`;
        console.log(query);
        this.client.query(query, values, function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    updateRecord(info) {
        const data = info.data;
        const record = info.record;
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map(field => `\`${field}\`=?`);
        const fields1 = Object.keys(record);
        const values1 = Object.values(record);
        const where = fields1.map(field => `\`${field}\`=?`).join(" AND ");
        console.log("data ->", fields, values);
        let query = `UPDATE \`${info.table}\` SET ${update} WHERE ${where};`;
        console.log(query);
        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    deleteRecord(info) {
        const record = info.record;
        console.log("doDelete ->", record);
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields.map(field => `\`${field}\`=?`).join(" AND ");
        console.log("doDelete ->", fields, values);
        let query = `DELETE FROM \`${info.table}\` WHERE ${where};`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                //handle error
                console.log("Error ONDELETE", query, err);
            }
            else {
                console.log(result.rows);
            }
        });
        return;
    }
}
export class PostgreDB {
    constructor(info) {
        this.client = new pg.Client({
            user: info.user,
            host: info.host,
            database: info.dbase,
            password: info.pass,
            port: +(info.port || 5432),
        });
        console.log("8888");
        this.client.connect();
    }
    insertRecord(info) {
        console.log("info ->", info);
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = Object.keys(data).map((f, index) => "$" + (index + 1));
        console.log("data ->", fields, values, wildcard);
        let query = `INSERT INTO "${info.table}" ("${fields.join('","')}") VALUES (${wildcard.join(",")}) RETURNING *;`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                console.log("err ", err);
                //handle error
            }
            else {
                console.log("result.rows:", result.rows);
            }
        });
        return;
    }
    updateRecord(info) {
        const data = info.data;
        const record = info.record;
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index + 1}`);
        const fields1 = Object.keys(record);
        const values1 = Object.values(record);
        const where = fields1.map(field => `"${field}"=$${fields.length + 1}`).join(" AND ");
        console.log("data ->", fields, values);
        let query = `UPDATE "${info.table}" SET ${update} WHERE ${where};`;
        console.log(query);
        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    upsertRecord(info) {
        const data = info.data;
        if (info.serial !== undefined && !data[info.serial]) {
            console.log("hello");
            delete data[info.serial];
        }
        else {
            console.log("hello info", info, data);
        }
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1));
        const update = fields.map(field => `"${field}"=EXCLUDED.` + field);
        console.log("data ->", fields, values);
        let query = `INSERT INTO "${info.table}" ("${fields.join("\",\"")}") VALUES (${wildcard.join(",")}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;
        console.log(query, values);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                console.log("err", err);
                //handle error
            }
            else {
                console.log("ALL ", result, "ROWS", result.rows);
            }
            return;
        });
        return;
    }
    deleteRecord(info) {
        const record = info.record;
        console.log("doDelete ->", record);
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");
        console.log("doDelete ->", fields, values);
        console.log("Where  ->", where, `--${where}--`);
        let query = `DELETE FROM "${info.table}" WHERE ${where};`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                //handle error
                console.log("Error ONDELETE", query, err);
            }
            else {
                console.log(result.rows);
            }
        });
        return;
    }
    doInsert(table, data) {
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1)).join(",");
        console.log("data ->", fields, values, wildcard);
        let query = `INSERT INTO "${table}" ("${fields.join('","')}") VALUES (${wildcard}) RETURNING *;`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                //handle error
            }
            else {
                console.log(result.rows);
            }
        });
        return;
    }
    doInsertOrUpdate(table, data) {
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        const wildcard = fields.map((f, index) => "$" + (index + 1)).join(",");
        const update = fields.map(field => `"${field}"=EXCLUDED.` + field);
        console.log("data ->", fields, values);
        let query = `INSERT INTO "${table}" ("${fields.join("\",\"")}") VALUES (${wildcard}) 
            ON CONFLICT (id) DO UPDATE SET ${update} RETURNING *;`;
        console.log(query, values);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                console.log("err", err);
                //handle error
            }
            else {
                console.log("ALL ", result, "ROWS", result.rows);
            }
            return;
        });
        return;
    }
    doUpdate(table, data, record) {
        console.log("data ->", data);
        const fields = Object.keys(data);
        const values = Object.values(data);
        //const wildcard = "?".repeat(fields.length).split("").join(",");
        const update = fields.map((field, index) => `"${field}"=$${index + 1}`);
        const fields1 = Object.keys(record);
        const values1 = Object.values(record);
        const where = fields1.map(field => `"${field}"=$${fields.length + 1}`).join(" AND ");
        console.log("data ->", fields, values);
        let query = `UPDATE "${table}" SET ${update} WHERE ${where};`;
        console.log(query);
        this.client.query(query, [...values, ...values1], function (err, rows, fields) {
            if (err)
                throw err;
            //console.log(rows[0]);
            console.log(rows, fields);
        });
        return;
    }
    doDelete(table, record) {
        console.log("doDelete ->", record);
        const fields = Object.keys(record);
        const values = Object.values(record);
        const where = fields.map((field, index) => `"${field}"=$${index + 1}`).join(" AND ");
        console.log("doDelete ->", fields, values);
        console.log("Where  ->", where, `--${where}--`);
        let query = `DELETE FROM "${table}" WHERE ${where};`;
        console.log(query);
        const res = /*await*/ this.client.query(query, values, function (err, result) {
            if (err) {
                //handle error
                console.log("Error ONDELETE", query, err);
            }
            else {
                console.log(result.rows);
            }
        });
        return;
    }
}
//# sourceMappingURL=db.js.map