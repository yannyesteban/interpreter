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
        this.connection = "_defaul";
        this.sqlUser = "SELECT * FROM `user` WHERE `user` = ?";
        this.sqlGroup = "SELECT `group` FROM user_group WHERE `user` = ?";
        this.message = "user was autorized correctly";
        this.messageError = "credentials is wrong!";
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        const source = this.store.getSes("JSON_PATH") + info.source + ".json";
        const config = this.store.loadJsonFile(source);
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
            let message = this.messageError;
            this.user = user;
            this.db = this.store.db.get(this.connection);
            const result = yield this.db.query(this.sqlUser, [user]);
            if (result.rows) {
                const row = result.rows[0];
                if (row.pass == pass) {
                    error = 0;
                    this.auth = true;
                    this.roles = yield this.dbRoles(user);
                    message = this.message;
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
                        auth: this.auth,
                        error
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
            const result = yield this.db.query(this.sqlGroup, [user]);
            if (result.rows) {
                return result.rows.map(row => row.group);
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