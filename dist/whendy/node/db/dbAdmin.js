import { MysqlDB } from "./mysqlDB.js";
import { PostgreDB } from "./postgresDB.js";
import { SQLiteDB } from "./sqliteDB.js";
export class DBAdmin {
    constructor() {
        this.dbs = {};
    }
    init(data) {
        this.info = data.reduce((ac, item) => {
            ac[item.driver.toLowerCase()] = item;
            return ac;
        }, {});
    }
    create(driver) {
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
    get(name) {
        if (!this.dbs[name]) {
            this.dbs[name] = this.create(this.info[name].driver);
            this.dbs[name].connect(this.info[name]);
        }
        return this.dbs[name];
    }
}
//# sourceMappingURL=dbAdmin.js.map