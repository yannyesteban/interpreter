var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Element } from "./element.js";
export class User extends Element {
    constructor() {
        super(...arguments);
        this.element = "";
        this.auth = false;
        this.user = "";
        this.roles = [];
        this.response = [];
        this.store = null;
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        const config = this.store.loadJsonFile(info.source);
        for (const [key, value] of Object.entries(Object.assign(Object.assign({}, config), info))) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("user: ", method, this.store.getReq("user"), this.store.getReq("pass"));
            switch (method) {
                case "login":
                    const user = this.store.getReq("user");
                    const pass = this.store.getReq("pass");
                    yield this.dbLogin(user, pass);
                    break;
            }
        });
    }
    dbLogin(user, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            let security = "md5";
            let error = 1;
            let message = "credentials is wrong!";
            this.user = user;
            let db = this.store.db.get("whendy");
            const result = yield db.getRecord("SELECT * FROM user WHERE user = ?", [user]);
            if (result) {
                if (result.pass == pass) {
                    error = 0;
                    this.auth = true;
                    this.roles = yield this.dbRoles(user);
                    message = "user was autorized correctly";
                }
            }
            const data = {
                mode: "init",
                type: "element",
                wc: "wh-app",
                props: {
                    store: {
                        user: user,
                        message,
                        roles: this.roles,
                        auth: this.auth
                    }
                },
                //replayToken => $this->replayToken,
                appendTo: this.appendTo,
                setPanel: this.setPanel,
            };
            this.addResponse(data);
        });
    }
    dbRoles(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = this.store.db.get("whendy");
            const result = yield db.getData("SELECT `group` FROM user_group WHERE user = ?", [user]);
            if (result) {
                return result.map(row => row.group);
            }
            return [];
        });
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
    getUserInfo() {
        return {
            auth: this.auth,
            user: this.user,
            roles: this.roles
        };
    }
}
//# sourceMappingURL=user.js.map