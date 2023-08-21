import { IConnectInfo } from "../dataModel.js";
import { DB } from "./db.js";
export declare class DBAdmin {
    dbs: {
        [key: string]: DB;
    };
    info: {
        [key: string]: IConnectInfo;
    };
    init(data: IConnectInfo[]): void;
    private create;
    get<T>(name: string): T;
}
