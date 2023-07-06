import { DBSql } from "./db/db.js";
import { InfoElement, Element, IUserAdmin, UserInfo } from "./element.js";
import { Store } from "./store.js";

export class User extends Element implements IUserAdmin {


    public id: string;
    public name: string;
    public element: string = "";
    public className: string | string[];
    public setPanel: string;
    public appendTo: string;

    public auth: boolean = false;
    public user: string = "";
    public roles: string[] = [];

    response: object[] = [];

    store: Store = null;

    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {

        const config = this.store.loadJsonFile(info.source);

        for (const [key, value] of Object.entries({ ...config, ...info })) {
            this[key] = value;
        }
    }

    async evalMethod(method: string) {
        console.log("user: ", method, this.store.getReq("user"), this.store.getReq("pass"))
        switch (method) {
            case "login":
                const user = this.store.getReq("user");
                const pass = this.store.getReq("pass");
                await this.dbLogin(user, pass);
                break;
        }
    }

    async dbLogin(user: string, pass: string) {

        let security = "md5";
        let error = 1;
        
        let message = "credentials is wrong!"

        this.user = user;

        let db = this.store.db.get<DBSql>("postgres");

        const [result] = await db.query('SELECT * FROM "user" WHERE "user" = $1', [user]);

        if (result) {
            
            if (result.pass == pass) {
                error = 0;
                this.auth = true;
                this.roles = await this.dbRoles(user);
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
                    auth: this.auth,
                    error
                }
            },
            //replayToken => $this->replayToken,
            appendTo: this.appendTo,
            setPanel: this.setPanel,
        };

        this.addResponse(data);
    }

    async dbRoles(user: string) {

        let db = this.store.db.get<DBSql>("whendy");

        const result = await db.query("SELECT `group` FROM user_group WHERE user = ?", [user]);

        if (result) {

            return result.map(row => row.group);

        }

        return [];
    }

    getResponse(): object[] {
        return this.response;
    }

    addResponse(response) {
        this.response.push(response);
    }

    getUserInfo(): UserInfo {
        return {
            auth: this.auth,
            user: this.user,
            roles: this.roles
        }
    }
}
