import { Class } from "../../core/Statement";
import { randomBytes, randomUUID } from "node:crypto";
import { ServerResponse } from "node:http"

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

    static start(req, res: ServerResponse) {
        console.log(req.headers["cookie"])
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Set-Cookie', [`aaa${this.cookieName}=${this.sessionId()};Domain=localhost;SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`]);

        
        res.setHeader('Cookie-Setup',        ['Alfa=Beta', 'Beta=Romeo']);
        
    }
}