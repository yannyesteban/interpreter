import { Element } from "./element.js";
export class User extends Element {
    constructor() {
        super(...arguments);
        this.element = "";
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
        switch (method) {
            case "login":
                const user = this.store.getReq("user");
                const pass = this.store.getReq("pass");
                this.dbLogin(user, pass);
                break;
        }
    }
    dbLogin(user, pass) {
        let security = "md5";
        let error = 0;
        let auth = false;
        if (error === 0) {
            this.user = user;
            this.roles = this.dbRoles(user);
        }
        const data = {
            mode: "init",
            type: "element",
            wc: "wh-app",
            props: {
                store: {
                    message: "ok"
                }
            },
            //replayToken => $this->replayToken,
            appendTo: this.appendTo,
            setPanel: this.setPanel,
        };
        this.addResponse(data);
    }
    dbRoles(user) {
        return [""];
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
    getUserInfo() {
        return {
            user: this.user,
            roles: this.roles
        };
    }
}
//# sourceMappingURL=user.js.map