import { WhSQLite } from "./wh-sqlite.js";
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
    }
    doUpdate(table, data, key) {
    }
    doInsertOrUPdate(table, data) {
    }
    begin() {
    }
    commit() {
    }
}
//# sourceMappingURL=db.js.map