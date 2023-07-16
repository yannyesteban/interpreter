import { MysqlDB } from "./mysqlDB.js";
import { PostgreDB } from "./postgresDB.js";
import { SQLiteDB } from "./sqliteDB.js";
export class DBAdmin {
    constructor() {
        this.dbs = {};
    }
    init(data) {
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
            this.dbs[info.name].connect(info);
        }
    }
    get(name) {
        return this.dbs[name];
    }
}
//# sourceMappingURL=dbAdmin.js.map