/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
export interface ISession {
    id: string;
    data: object;
    set(key: string, value: any): void;
    get(key: string): any;
    delete(key: string): void;
    getSessionId(): string;
    loadSession(data: {
        [key: string]: any;
    }): void;
    getData(): {
        [key: string]: any;
    };
}
export interface IMachine {
    sessions: {
        [id: string]: ISession;
    };
    init(sessionId: string): ISession;
    read(sessionId: string): ISession;
}
export declare function register(name: string, machine: any): void;
export declare function create(config: any): Manager;
export declare class Manager {
    cookieName: any;
    machine: IMachine;
    machineType: string;
    constructor(config: object);
    create(value: string): ISession;
    start(req: IncomingMessage, res: ServerResponse): ISession;
}
