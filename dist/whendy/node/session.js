import { randomBytes, randomUUID } from "node:crypto";
import { CookieHandler, CookieVar } from "./CookieHandler.js";
export class Machine {
    constructor(config) {
        console.log(randomUUID());
        console.log("register ", config);
    }
}
class Session {
    static register(name, machine) {
        if (this.machines[name]) {
            console.error("machine yet exists");
        }
        this.machines[name] = machine;
    }
    static create(config) {
        this.cookieName = config.cookieName;
        if (this.machines[config.machineType]) {
            let machine = this.machines[config.machineType];
            return new machine(config);
        }
    }
    static sessionId() {
        return randomBytes(32).toString("base64url");
    }
    static start(req, res) {
        const cooker = new CookieHandler(req, res);
        let sessionCookie;
        if (cooker.get(this.sessionId())) {
            sessionCookie = cooker.get(this.cookieName);
        }
        else {
            sessionCookie = new CookieVar(this.cookieName, this.sessionId());
        }
        console.log(req.headers["cookie"]);
        cooker.setCookie(sessionCookie);
        cooker.setCookie((new CookieVar("VAR 1", "ONE")).get());
        cooker.setCookie((new CookieVar("VAR 2", "TWO")).get());
        //res.setHeader('Content-Type', 'text/html');
        //res.setHeader('Set-Cookie', [sessionCookie.get(), "test=cuarentena", (new CookieVar("SO", "Debian")).get()]);
        //res.setHeader('Set-Cookie', [`${this.cookieName}=${this.sessionId()}; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`, "test=cuarentena"]);
        //res.setHeader('Cookie-Setup',        ['Alfa=Beta', 'Beta=Romeo']);
    }
}
Session.machines = {};
export { Session };
//# sourceMappingURL=session.js.map