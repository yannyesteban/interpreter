import * as http from "http";
import { register, Manager } from "./manager.js";
import { CookieVar } from "./CookieHandler.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import * as classManager from "./classManager.js";

import { IConnectInfo } from "./dataModel.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";

interface InfoClass {
    name: string;
    enable: boolean;
    file: string;
    class: string;
}

export class Whendy extends http.Server {
    private port = 8080;

    private session;
    private store: Store;
    private userManager: Authorization;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies: CookieVar[] = [];

    header: { [key: string]: string | number } = {};

    setApp: InfoElement;
    constants;
    db: IConnectInfo[];
    classElement: InfoClass[] = [];

    output: OutputInfo[] = [];
    private restData: any;
    private mode: string;
    
    constructor(opt: object) {
        super();

        for (const [key, value] of Object.entries(opt)) {
            this[key] = value;
        }

        register("memory", Memory);
        classManager.register(this.classElement);

        let manager = new Manager({
            cookieName: "whsessionid",
            machineType: "memory",
            maxLifeTime: 36000,
        });

        this.on("request", async (req: http.IncomingMessage, res: http.ServerResponse) => {
            this.userManager = new Authorization();

            this.userManager.evalHeader(req, res);

            if (req.method.toLocaleUpperCase() == "OPTIONS") {
                res.writeHead(204, this.header);
                res.end();
                return;
            }

            const session = manager.start(req, res);
            session.loadSession(this.constants);

            const db = new DBAdmin();
            db.init(this.db);

            const store = new Store();
            store.setSessionAdmin(session);
            store.setDBAdmin(db);

            await store.start(req, res);

            this.store = store;

            /*for (const [key, value] of Object.entries(this.header)) {
               res.setHeader(key, value);
            }*/

            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            res.write(await this.render());

            res.end();

            console.log("USER INFO", this.userManager.getUserInfo());
        });
    }

    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

    public start() {
        this.listen(this.port);
    }

    async render() {
        this.output = [];
        this.mode = this.store.getHeader("Application-Mode").toString();
        if (this.mode === "start") {
            console.log("START");
            await this.setElement(this.setApp);
        }

        let request = this.store.getReq("__app_request");

        if (request) {
            if (typeof request === "string") {
                request = JSON.parse(request);
            }

            await this.evalRequest(request);
        }

        if(this.mode === "restapi"){
            return JSON.stringify(this.restData);
        }
        return JSON.stringify(this.output);
    }

    addResponse(response: OutputInfo[]) {
        this.output = [...this.output, ...response];
    }

    async evalRequest(requests: []) {
        for (let request of requests) {
            await this.evalCommand(request);
        }
    }

    async evalCommand(command) {
        switch (command.type) {
            case "init":
                await this.setElement(command);

            case "element":
                console.log(command);
                await this.setElement(command);

            case "update":

            default:
        }
    }

    async setElement(info: InfoElement) {
        this.store.setExp("ID_", info.id);
        this.store.setExp("ELEMENT_", info.element);
        //this.store.LoadExp(info.eparams)

        const cls = await classManager.getClass(info.element);

        if (!cls) {
            console.log("error, clas not found");
            return;
        }

        const ele: Element = new cls();

        ele.setStore(this.store);
        ele.init(info);
        await ele.evalMethod(info.method);

        if (this.mode == "restapi") {
            this.doRestData(ele);
        } else {
            this.addResponse(ele.getResponse());
        }

        this.doUserAdmin(ele);
        await this.doElementAdmin(ele);
    }

    async doElementAdmin(ele: IElementAdmin | Element) {
        if ("getElements" in ele) {
            const elements = ele.getElements();
            if (!Array.isArray(elements)) {
                return false;
            }

            for (const element of elements) {
                await this.setElement(element);
            }
        }
    }

    async doUserAdmin(ele: IUserAdmin | Element) {
        if ("getUserInfo" in ele) {
            const info = ele.getUserInfo();

            if (info.auth) {
                console.log(`********\nWelcome ${info.user}\n**`);

                const token = this.userManager.setAuth(info);

                this.addResponse([
                    {
                        mode: "auth",
                        props: { token },
                    },
                ]);

                //token := whendy.Store.User.Set(info)
                //whendy.w.Header().Set("Authorization", token)
            } else {
                console.log("====\nError\n==");
            }
        }
    }

    doRestData(ele: IRestElement | Element) {
        if ("getRestData" in ele) {
            this.setRestData(ele.getRestData());
        }
    }

    setRestData(data) {
        this.restData = data;
    }
}
