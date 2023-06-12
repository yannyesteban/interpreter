import { randomBytes, randomUUID } from "node:crypto";
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
        console.log(req.headers["cookie"]);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Set-Cookie', [`aaa${this.cookieName}=${this.sessionId()};Domain=localhost;SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`]);
        res.setHeader('Cookie-Setup', ['Alfa=Beta', 'Beta=Romeo']);
    }
}
Session.machines = {};
export { Session };
//# sourceMappingURL=session.js.map