import { randomBytes } from "node:crypto";
import { cookieParse, CookieVar } from "./CookieHandler.js";
const machines = {};
export function register(name, machine) {
    if (machines[name]) {
        console.error("machine yet exists");
    }
    machines[name] = machine;
}
export function create(config) {
    this.cookieName = config.cookieName;
    if (this.machines[config.machineType]) {
        let machine = this.machines[config.machineType];
        return new Manager(config);
    }
}
function sessionId() {
    return randomBytes(32).toString("base64url");
}
export class Manager {
    constructor(config) {
        this.machineType = "memory";
        for (const [key, value] of Object.entries(config)) {
            this[key] = value;
        }
        this.machine = new machines[this.machineType]();
    }
    start(req, res) {
        var _a;
        const cookies = cookieParse((_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie);
        let id = null;
        const cookie = cookies[this.cookieName];
        if (!cookie) {
            id = sessionId();
            const sessionCookie = new CookieVar(this.cookieName, id);
            res.appendHeader("Set-Cookie", sessionCookie.get());
        }
        else {
            id = cookie.getValue();
        }
        return this.machine.init(id);
    }
}
//# sourceMappingURL=manager.js.map