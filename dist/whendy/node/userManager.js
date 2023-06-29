import { JWT } from "./JWT.js";
import { log } from "console";
let t = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
export class UserManager {
    constructor() {
        this.jwt = new JWT({});
        log("####", this.jwt.verify(t));
    }
    evalHeader(req, res) {
        this.req = req;
        this.res = res;
        const value = req.headers["Authorization"];
        if (value) {
            let [, token] = value.toString().split(" ");
            this.verify(token);
        }
    }
    verify(token) {
        const payload = this.jwt.verify(token);
        if (payload) {
            this.user = payload.user;
            this.roles = payload.roles;
        }
    }
    setUserInfo(info) {
    }
    getUserInfo() {
        return;
    }
    getRoles() {
        return this.roles;
    }
    validRoles(roles) {
        return true;
    }
}
//# sourceMappingURL=userManager.js.map