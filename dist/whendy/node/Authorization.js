import { JWT } from "./JWT.js";
let t = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
export class Authorization {
    constructor() {
        this.auth = false;
        this.user = "";
        this.roles = [];
        this.jwt = new JWT({});
        //log("####", this.jwt.verify(t))
    }
    evalHeader(req, res) {
        this.req = req;
        this.res = res;
        const value = req.headers["authorization"];
        if (value) {
            return this.verify(value.toString().split(" ").pop());
        }
        return false;
    }
    verify(token) {
        const payload = this.jwt.verify(token);
        console.log(payload);
        if (payload) {
            this.auth = true;
            this.user = payload.user;
            this.roles = payload.roles;
            return true;
        }
        else
            false;
    }
    setAuth(info) {
        this.auth = info.auth;
        this.user = info.user;
        this.roles = info.roles;
        const token = this.jwt.generate({
            user: info.user,
            roles: info.roles,
        });
        return token;
    }
    setUserInfo(info) { }
    getUserInfo() {
        return {
            auth: this.auth,
            user: this.user,
            roles: this.roles,
        };
    }
    getRoles() {
        return this.roles;
    }
    validRoles(roles) {
        const intersection = this.roles.filter((x) => roles.indexOf(x) !== -1);
        return intersection.length > 0;
    }
}
//# sourceMappingURL=Authorization.js.map