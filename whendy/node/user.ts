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

    db: DBSql;

    private connection: string = "_defaul";
    private sqlUser: string = "SELECT * FROM `user` WHERE `user` = ?";
    private sqlGroup: string = "SELECT `group` FROM user_group WHERE `user` = ?";
    private message: string = "user was autorized correctly";
    private messageError: string = "credentials is wrong!";

    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {


        const source = this.store.getSes("JSON_PATH") + info.source + ".json";

        const config = this.store.loadJsonFile(source);

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

        let message = this.messageError;

        this.user = user;

        this.db = this.store.db.get<DBSql>(this.connection);

        const result = await this.db.query(this.sqlUser, [user]);

        if (result.rows) {
            const row = result.rows[0];

            if (row.pass == pass) {
                error = 0;
                this.auth = true;
                this.roles = await this.dbRoles(user);
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
    }

    async dbRoles(user: string) {

        const result = await this.db.query(this.sqlGroup, [user]);

        if (result.rows) {
            return result.rows.map(row => row.group);
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
