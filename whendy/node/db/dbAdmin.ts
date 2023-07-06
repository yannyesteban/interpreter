import { IConnectInfo } from "../dataModel.js";
import { DB } from "./db.js";
import { MysqlDB } from "./mysqlDB.js";
import { PostgreDB } from "./postgresDB.js";
import { SQLiteDB } from "./sqliteDB.js";
import { WhSQLite } from "./wh-sqlite.js";

export class DBAdmin {
    dbs: { [key: string]: DB } = {};

    
    init(data: IConnectInfo[]) {
        for (let info of data) {
            switch (info.driver) {
                case "sqlite":
                    this.dbs[info.name] = new SQLiteDB();
                    break;
                case "mysql":
                    this.dbs[info.name] = new MysqlDB();
                    break; 
                case "postgre":
                case "postgres":
                case "postgresql":
                    this.dbs[info.name] = new PostgreDB();
                    break;
                default:
                    continue; 
            }

            console.log(info, "....")
            this.dbs[info.name].connect(info);
        }
    }

    get<T>(name: string): T {
        
        return this.dbs[name] as T;
    }
 
}