/// <reference types="node" />
import * as http from "http";
import { ISession } from "./manager.js";
import { Outer } from "./../core/outer/Outer.js";
import { DBAdmin } from "./db/dbAdmin.js";
export declare class Store {
    vexp: {
        [id: string]: any;
    };
    vreq: {
        [id: string]: any;
    };
    vses: {
        [id: string]: any;
    };
    qpar: {
        [id: string]: any;
    };
    header: any;
    cookie: any;
    session: ISession;
    db: DBAdmin;
    request: http.IncomingMessage;
    response: http.ServerResponse;
    outer: Outer;
    setSessionAdmin(session: any): void;
    setDBAdmin(db: any): void;
    start(req: http.IncomingMessage, res: http.ServerResponse): Promise<unknown>;
    queryParams(data: any): void;
    getCookie(name: any): any;
    setCookie(name: any, value: any): void;
    getExp(name: any): any;
    setExp(name: any, value: any): void;
    getVReq(): {
        [id: string]: any;
    };
    setVReq(vreq: any): void;
    getReq(name: any): any;
    setReq(name: any, value: any): void;
    getSes(key: any): any;
    setSes(key: any, value: any): void;
    getHeader(key: string): string | string[];
    loadFile(name: string): string;
    loadJsonFile(name: string): any;
    eval(template: string): string;
    evalSubData(template: string, data: any): string;
}
