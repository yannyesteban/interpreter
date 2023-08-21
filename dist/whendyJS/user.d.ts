import { DBSql } from "./db/db.js";
import { InfoElement, Element, IUserAdmin, UserInfo } from "./element.js";
import { Store } from "./store.js";
export declare class User extends Element implements IUserAdmin {
    id: string;
    name: string;
    element: string;
    className: string | string[];
    setPanel: string;
    appendTo: string;
    auth: boolean;
    user: string;
    roles: string[];
    response: object[];
    store: Store;
    db: DBSql;
    private connection;
    private security;
    private sqlUser;
    private sqlGroup;
    private message;
    private messageError;
    setStore(store: Store): void;
    init(info: InfoElement): void;
    evalMethod(method: string): Promise<void>;
    dbLogin(user: string, pass: string): Promise<void>;
    dbRoles(user: string): Promise<any>;
    getResponse(): object[];
    addResponse(response: any): void;
    getUserInfo(): UserInfo;
    encrypt(type: string, pass: string): string;
}
