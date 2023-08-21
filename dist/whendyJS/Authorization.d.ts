/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { JWT } from "./JWT.js";
import { UserInfo } from "./element.js";
export declare class Authorization {
    auth: boolean;
    user: string;
    roles: string[];
    jwt: JWT;
    req: any;
    res: any;
    constructor();
    evalHeader(req: IncomingMessage, res: ServerResponse): boolean;
    verify(token: any): boolean;
    setAuth(info: UserInfo): string;
    setUserInfo(info: UserInfo): void;
    getUserInfo(): UserInfo;
    getRoles(): string[];
    validRoles(roles: string[]): boolean;
}
