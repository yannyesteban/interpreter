/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
export declare function cookieParse(str: string): {
    [key: string]: CookieVar;
};
export declare class CookieVar {
    name: any;
    value: any;
    domain: any;
    path: any;
    expires: any;
    secure: boolean;
    httpOnly: boolean;
    sameSite: any;
    constructor(name: any, value: any, domain?: any, path?: any, expires?: any, secure?: any, httpOnly?: any, sameSite?: any);
    get(): string;
    getValue(): any;
}
export declare class CookieHandler {
    req: any;
    res: any;
    result: any[];
    cookies: {
        [key: string]: CookieVar;
    };
    constructor(req: IncomingMessage, res: ServerResponse);
    add(cookie: CookieVar): void;
    get(name: any): CookieVar;
    has(name: any): boolean;
    toArray(): any[];
    setCookie(cookie: any): void;
}
