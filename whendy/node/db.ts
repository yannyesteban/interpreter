import { IConnectInfo, ISQLDBase } from "./dataModel.js"
import { WhSQLite } from "./wh-sqlite.js";


export class DBAdmin{
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

    doInsert(table, data){

    }

    doUpdate(table, data, key){

    }

    doInsertOrUPdate(table, data){

    }

    begin(){

    }

    commit(){

    }
}





