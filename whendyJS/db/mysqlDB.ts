import { IConnectInfo } from "../dataModel.js";
import { DB, DBSql, IFieldInfo, IRecordAdmin, IRecordInfo, QueryResult, STMT, STMTResult } from "./db.js";
import * as mysql from "mysql";

enum FLAGS {
  NOT_NULL_FLAG = 1,
  PRI_KEY_FLAG = 2,
  MULTIPLE_KEY_FLAG = 8,
  BLOB_FLAG = 16,
  UNSIGNED_FLAG = 32,
  ENUM_FLAG = 256,
  AUTO_INCREMENT_FLAG = 512,
  TIMESTAMP_FLAG = 1024,
  UNIQUE_FLAG = 65536,
}

export class MysqlDB extends DBSql {
  client;
  dbase: string;
  query(sql: string, param?: any[]): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.client.query(sql, param, (error, results, fields) => {
        if (error) {
          resolve({
            errno: 0,
            error: null,
            rows: results,
            fields,
          });
        } else {
          fields = fields.map((field, index) => {
            const { type, length, decimals } = this.evalType(field);
            const { serial, unique, notNull, primaryKey } = this.evalFlags(field.flags);
            return {
              cat: field.catalog,
              db: field.db,
              table: field.table,
              field: field.name,
              serial,
              primaryKey,
              unique,
              pos: index + 1,
              notNull,
              type,
              length,
              decimals,
            };
          });

          resolve({
            errno: 0,
            error: null,
            rows: results,
            fields,
          });
        }
      });
    });
  }
  async infoQuery(q: string): Promise<IFieldInfo[]> {
    throw new Error("Method not implemented.");
  }
  async infoTable(table: string, dbase?: string): Promise<IFieldInfo[]> {
    const { rows } = await this.query(
      `SELECT
                TABLE_CATALOG as 'cat', TABLE_SCHEMA as db, TABLE_NAME as 'table', COLUMN_NAME as 'field', ORDINAL_POSITION as 'pos', IS_NULLABLE as 'null', DATA_TYPE as  'type',
                COALESCE(CHARACTER_MAXIMUM_LENGTH, NUMERIC_PRECISION) as length, COALESCE(NUMERIC_SCALE, 0) as 'decimals',
                COLUMN_KEY as 'key', EXTRA as extra
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY pos;`,
      [dbase || this.dbase, table],
    );

    return rows.map((row) => {
      const { type, length, decimals } = this.evalType(row);
      return {
        cat: row.cat,
        db: row.db,
        table: row.table,
        field: row.field,
        serial: row.extra === "auto_increment" ? true : false,
        primaryKey: row.key === "PRI" ? true : false,
        unique: row.key === "UNI" ? true : false,
        pos: row.pos,
        notNull: row.null === "NO" ? true : false,
        type,
        length: length + decimals,
        decimals,
      };
    });
  }

  evalFlags(flags) {
    let serial = false;
    let unique = false;
    let notNull = false;
    let primaryKey = false;

    if (flags & FLAGS.NOT_NULL_FLAG) {
      notNull = true;
    }
    if (flags & FLAGS.PRI_KEY_FLAG) {
      primaryKey = true;
    }

    if (flags & FLAGS.AUTO_INCREMENT_FLAG) {
      serial = true;
    }
    if (flags & FLAGS.UNIQUE_FLAG) {
      unique = true;
    }

    return { serial, unique, notNull, primaryKey };
  }
  evalType(row): any {
    let type: string = String(row.type);
    let length = +row.length || 0;
    let decimals = +row.decimals || 0;

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
        //length = length || numeric;
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

    return { type, length, decimals };
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
    this.dbase = info.dbase;

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

      let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(",")});`;

      console.log(query);

      this.client.query(query, values, function (err, rows, fields) {
        if (err) {
          resolve({
            row: null,
            errno: err.errno,
            error: err.sqlMessage,
            lastId: null,
          });
        }

        data[info.serial] = rows?.insertId;

        resolve({
          row: data,
          errno: 0,
          error: "",
          lastId: rows?.insertId || null,
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

      let query = `INSERT INTO \`${info.table}\` (\`${fields.join("`,`")}\`) VALUES (${wildcard.join(
        ",",
      )}) AS new ON DUPLICATE KEY UPDATE ${update};`;

      console.log(query);

      this.client.query(query, values, function (err, rows, fields) {
        if (err) {
          resolve({
            row: null,
            errno: err.errno,
            error: err.sqlMessage,
            lastId: null,
          });
        }

        data[info.serial] = rows.insertId;

        resolve({
          row: data,
          errno: 0,
          error: "",
          lastId: rows.insertId,
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
            lastId: null,
          });
        }

        resolve({
          row: data,
          errno: 0,
          error: "",
          lastId: null,
        });
      });
    });
  }

  deleteRecord(info: IRecordInfo): Promise<STMTResult> {
    return new Promise((resolve, reject) => {
      const record = info.record;

      
      const fields = Object.keys(record);
      const values = Object.values(record);

      const where = fields.map((field) => `\`${field}\`=?`).join(" AND ");

      
      let query = `DELETE FROM \`${info.table}\` WHERE ${where};`;

      console.log(query);

      this.client.query(query, values, function (err, rows, fields) {
        if (err) {
          resolve({
            row: null,
            errno: err.errno,
            error: err.sqlMessage,
            lastId: null,
          });
        }

        resolve({
          row: null,
          errno: 0,
          error: "",
          lastId: null,
        });
      });
    });
  }
}
