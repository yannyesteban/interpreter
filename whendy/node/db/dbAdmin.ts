import { IConnectInfo } from "../dataModel.js";
import { DB } from "./db.js";
import { MysqlDB } from "./mysqlDB.js";
import { PostgreDB } from "./postgresDB.js";
import { SQLiteDB } from "./sqliteDB.js";

export class DBAdmin {
  dbs: { [key: string]: DB } = {};

  info: { [key: string]: IConnectInfo };

  init(data: IConnectInfo[]) {
    this.info = data.reduce((ac: { [key: string]: IConnectInfo }, item) => {
      ac[item.driver.toLowerCase()] = item;
      return ac;
    }, {});
    
  }

  private create(driver) {
    switch (driver) {
      case "sqlite":
        return new SQLiteDB();
      case "mysql":
        return new MysqlDB();
      case "postgre":
      case "postgres":
      case "postgresql":
        return new PostgreDB();
      default:
        throw new Error("driver not found");
    }
  }
  get<T>(name: string): T {
    if (!this.dbs[name]) {
      this.dbs[name] = this.create(this.info[name].driver);
      this.dbs[name].connect(this.info[name]);
    }
    return this.dbs[name] as T;
  }
}
