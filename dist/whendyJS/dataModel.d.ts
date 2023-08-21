export interface ISQLDBase {
    connect(info: IConnectInfo): any;
    execute(sql: string, param?: string[]): any;
    query(sql: string, options: object): any;
    getData(sql: string, param?: string[]): any;
    getRecord(sql: string, param?: string[]): any;
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
    connLimit?: number;
    idleTimeout?: number;
    connTimeout?: number;
}
interface IQueryInfo {
    filters: {
        [key: string]: any;
    }[];
}
export declare class collection {
    scheme: string;
    table: string;
    constructor(table: string);
    findOne(filter: object): void;
}
export interface IDataModel {
    connect(info: IConnectInfo): any;
    insert(data: object[]): any;
    update(query: IQueryInfo, data: object[]): any;
    delete(query: IQueryInfo): any;
    getRecord(query: IQueryInfo): object;
    getRecords(query: IQueryInfo): object[];
    save(): any;
    execute(): any;
    getData(): any;
}
export {};
