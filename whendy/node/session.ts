import { Class } from "../../core/Statement";
import { randomBytes, randomUUID } from "node:crypto";
import { IncomingMessage, ServerResponse } from "node:http"
import { CookieHandler, CookieVar } from "./CookieHandler.js";

interface Window {

}

export class Machine implements Window {


    public constructor(config) {
        console.log(randomUUID());
        console.log("register ", config)

    }
}

export class Session {

    static cookieName;

    static machines: { [id: string]: Window } = {};

    static register(name: string, machine) {

        if (this.machines[name]) {
            console.error("machine yet exists");
        }

        this.machines[name] = machine;

    }

    static create(config) {

        this.cookieName = config.cookieName;
        if (this.machines[config.machineType]) {
            let machine: Machine = this.machines[config.machineType as string];
            return new (machine as any)(config)
        }
    }

    static sessionId() {
        return randomBytes(32).toString("base64url");

    }

    static start(req:  IncomingMessage, res: ServerResponse) {

        const cooker = new CookieHandler(req, res);

        let sessionCookie;
        if (cooker.get(this.sessionId())) {
            sessionCookie = cooker.get(this.cookieName);
        } else {
            sessionCookie = new CookieVar(this.cookieName, this.sessionId())
        }
        console.log(req.headers["cookie"])

        cooker.setCookie(sessionCookie);
        cooker.setCookie((new CookieVar("VAR 1", "ONE")).get());
        cooker.setCookie((new CookieVar("VAR 2", "TWO")).get());

        //res.setHeader('Content-Type', 'text/html');

        //res.setHeader('Set-Cookie', [sessionCookie.get(), "test=cuarentena", (new CookieVar("SO", "Debian")).get()]);
        //res.setHeader('Set-Cookie', [`${this.cookieName}=${this.sessionId()}; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`, "test=cuarentena"]);


        //res.setHeader('Cookie-Setup',        ['Alfa=Beta', 'Beta=Romeo']);

    }
}