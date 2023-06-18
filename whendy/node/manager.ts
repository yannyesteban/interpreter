import { Class } from "../../core/Statement";
import { randomBytes, randomUUID } from "node:crypto";
import { IncomingMessage, ServerResponse } from "node:http"
import { cookieParse, CookieVar } from "./CookieHandler.js";

export interface ISession {
    id: string;
    data: object;
    set(key: string, value: any): void;
    get(key: string): any;
    delete(key: string): void;
    getSessionId(): string;
}

export interface IMachine {
    sessions: { [id: string]: ISession }
    init(sessionId: string): ISession;
    read(sessionId: string): ISession;
}


const machines: { [name: string]: IMachine } = {};

export function register(name: string, machine) {

    if (machines[name]) {
        console.error("machine yet exists");
    }

    machines[name] = machine;

}
export function create(config) {

    this.cookieName = config.cookieName;
    if (this.machines[config.machineType]) {
        let machine: IMachine = this.machines[config.machineType as string];
        return new Manager(config)
    }
}

function sessionId() {
    return randomBytes(32).toString("base64url");

}



export class Manager {

    cookieName;



    machine: IMachine;

    machineType: string = "memory";

    constructor(config: object) {
        for (const [key, value] of Object.entries(config)) {
            this[key] = value;
        }

        this.machine = new (machines[this.machineType] as any)()

        console.log("'cookieName'", this.cookieName)
    }



    start(req: IncomingMessage, res: ServerResponse): ISession {
        
        const cookies = cookieParse(req.headers?.cookie);

        let id = null;
        const cookie = cookies[this.cookieName];
        
        if (!cookie) {
            id = sessionId();
            const sessionCookie = new CookieVar(this.cookieName, id);
            res.appendHeader("Set-Cookie", sessionCookie.get());
        } else {
            id = cookie.getValue();
        }

        return this.machine.init(id);

    }
}

//register("memory", Memory);