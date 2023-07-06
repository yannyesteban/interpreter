


export interface ISQLDBase {
    connect(info: IConnectInfo);
    execute(sql: string, param?: string[]);
    query(sql: string, options: object);
    getData(sql: string, param?: string[]);
    getRecord(sql: string, param?: string[]);
}


export interface IConnectInfo {
    name?: string;
    driver?: string;
    host?: string;
    port?: string;
    user?: string;
    pass?: string;
    dbase?: string;
    charset?: string;
    
    connLimit?:number;
    idleTimeout?:number;
    connTimeout?:number; 
}

interface IQueryInfo {
    filters: { [key: string]: any }[];
}

interface IFieldInfo {
    name: string;
    type: string;
    length: number;


}

interface InfoModel {
    table: string[];
    db: string;
    scheme: string;
    fields: []
}

export class collection {


    scheme: string;
    table: string;

    constructor(table: string) {
        const aux = table.split(".");
        if (aux.length === 1) {
            this.table = aux[0];
        } else if (aux.length === 2) {
            this.scheme = aux[0];
            this.table = aux[1];
        } else if (aux.length === 3) {
            this.scheme = aux[1];
            this.table = aux[2];
        }
    }


    findOne(filter: object) {

    }
}
export interface IDataModel {


    connect(info: IConnectInfo);
    insert(data: object[]);
    update(query: IQueryInfo, data: object[]);
    delete(query: IQueryInfo);
    getRecord(query: IQueryInfo): object;
    getRecords(query: IQueryInfo): object[];
    save();
    execute();
    getData();

}

