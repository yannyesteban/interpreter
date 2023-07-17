import * as http from "http";
import { WebSocketServer } from "ws";

import { register, Manager } from "./manager.js";
import { CookieVar } from "./CookieHandler.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import * as classManager from "./classManager.js";

import { IConnectInfo } from "./dataModel.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";

enum AppMode {
    START = 1,
    RESTAPI,
}

interface InfoClass {
    name: string;
    enable: boolean;
    file: string;
    class: string;
}

export class Whendy {
    

    public store: Store;
    public authorization: Authorization;
    private output: OutputInfo[] = [];
    private restData: any;
    private mode: AppMode;
    private appInfo: InfoElement;

    async render() {
        this.output = [];

        if (this.mode === AppMode.START) {
            console.log("START");
            await this.setElement(this.appInfo);
        }

        let request = this.store.getReq("__app_request");

        if (request) {
            if (typeof request === "string") {
                request = JSON.parse(request);
            }

            await this.evalRequest(request);
        }

        if (this.mode === AppMode.RESTAPI) {
            return JSON.stringify(this.restData);
        }

        return JSON.stringify(this.output);
    }

    setApp(info: InfoElement) {
        this.appInfo = info;
    }
    setMode(mode: AppMode) {
        this.mode = mode;
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
                break;

            case "element":
                console.log(command);
                await this.setElement(command);
                break;
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

        if (this.mode == AppMode.RESTAPI) {
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

                const token = this.authorization.setAuth(info);

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

/**************************** */
export class Server {
    private port = 8080;
    private classElement: InfoClass[] = [];
    private constants: { [key: string]: any } = {};
    private header: { [key: string]: string | number } = {};

    private db: IConnectInfo[];
    private setApp: InfoElement;
    private apps: { [name: string]: InfoElement };
    //private authorization:authorization;

    constructor(opt) {
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

        http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
            if (req.method.toLocaleUpperCase() == "OPTIONS") {
                
                res.writeHead(204, this.header);
                res.end();
                return;
            }

            const wh = new Whendy();

            wh.authorization = new Authorization();

            wh.authorization.evalHeader(req, res);

            const session = manager.start(req, res);
            session.loadSession(this.constants);

            const db = new DBAdmin();
            db.init(this.db);

            const store = new Store();
            store.setSessionAdmin(session);
            store.setDBAdmin(db);

            await store.start(req, res);

            wh.store = store;

            /*
          for (const [key, value] of Object.entries(this.header)) {
               res.setHeader(key, value);
          }*/

            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            const appName = wh.store.getHeader("Application-Name") || null;
            const mode: string = null;
            
            if (appName) {
                
                wh.setApp(this.apps[appName.toString()]);
                wh.setMode(AppMode.START);
            }
            
            res.write(await wh.render());

            res.end();

            console.log("USER INFO", wh.authorization.getUserInfo());
        }).listen(this.port);
    }
}

export class Socket {
    private port = 8088;
    private classElement: InfoClass[] = [];
    private constants: { [key: string]: any } = {};
    private header: { [key: string]: string | number } = {};

    private websocket: { port: string; roles: string[] };
    private db: IConnectInfo[];
    private apps: { [name: string]: InfoElement };

    constructor(opt) {
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

        const wss = new WebSocketServer({ port: +this.websocket.port || this.port});

        wss.on("connection", async (ws, req) => {
            const wh = new Whendy();

            ws.on("message", async (data) => {
                const { body, mode, token, applicationName } = JSON.parse(data.toString());

                if (mode === "auth" || this.websocket.roles?.length == 0) {
                    const auth = new Authorization();
                    auth.verify(token);
                    if (this.websocket.roles?.length > 0 && !auth.validRoles(this.websocket.roles)) {
                        ws.send("user don't authorized");
                        ws.close();
                    }

                    const store = new Store();
                    const session = manager.create("sessionId");
                    session.loadSession(this.constants);

                    const db = new DBAdmin();
                    db.init(this.db);

                    store.setSessionAdmin(session);
                    store.setDBAdmin(db);

                    //await store.start(null, null);

                    wh.authorization = auth;
                    wh.store = store;

                    console.log("token", token);
                }
            
                wh.store.setVReq(body || {});

                if (applicationName) {
                    wh.setApp(this.apps[applicationName]);
                    wh.setMode(AppMode.START);
                }

                const result = await wh.render();
                console.log(result);
                ws.send(result);
               
            });

            ws.on("close", async (params) => {
                console.log("cerrando");
            });

            ws.on("error", (err) => {
                console.log("error", err);
            });

        });
    }
}

export class Server1 extends http.Server {
    private port = 8080;

    private session;
    private store: Store;
    private authorization: Authorization;

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
            this.authorization = new Authorization();

            this.authorization.evalHeader(req, res);

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

            console.log("USER INFO", this.authorization.getUserInfo());
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

        if (this.mode === "restapi") {
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

                const token = this.authorization.setAuth(info);

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
