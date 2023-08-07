var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as http from "http";
import { WebSocketServer } from "ws";
import { register, Manager } from "./manager.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import * as classManager from "./classManager.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";
import { Tool } from "./tool.js";
var AppMode;
(function (AppMode) {
    AppMode[AppMode["START"] = 1] = "START";
    AppMode[AppMode["RESTAPI"] = 2] = "RESTAPI";
})(AppMode || (AppMode = {}));
export class Whendy {
    constructor() {
        this.output = [];
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.output = [];
            if (this.start) {
                yield this.setElement(this.start);
            }
            let request = this.store.getReq("__app_request");
            if (request) {
                if (typeof request === "string") {
                    request = JSON.parse(request);
                }
                yield this.evalRequest(request);
            }
            if (this.mode === AppMode.RESTAPI) {
                return JSON.stringify(this.restData);
            }
            return JSON.stringify(this.output);
        });
    }
    setStart(info) {
        this.start = info;
    }
    setMode(mode) {
        this.mode = mode;
    }
    addResponse(response) {
        this.output = [...this.output, ...response];
    }
    evalRequest(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let request of requests) {
                yield this.evalCommand(request);
            }
        });
    }
    evalCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (command.type) {
                case "init":
                    yield this.setElement(command);
                    break;
                case "element":
                    yield this.setElement(command);
                    break;
                case "update":
                default:
            }
        });
    }
    getElementConfig(element, name) {
        let template = classManager.template(element);
        template = "modules/admin/" + template.replace("{name}", name);
        return this.store.loadJsonFile(template);
    }
    setElement(info) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.setExp("ID_", info.id);
            this.store.setExp("ELEMENT_", info.element);
            //this.store.LoadExp(info.eparams)
            const cls = yield classManager.getClass(info.element);
            if (!cls) {
                console.log("error, clas not found");
                return;
            }
            const ele = new cls();
            ele.setStore(this.store);
            let config = info;
            if (classManager.useFileConfig(info.element)) {
                config = Object.assign(Object.assign({}, this.getElementConfig(info.element, info.name)), info);
            }
            ele.init(config);
            yield ele.evalMethod(info.method);
            if (this.mode == AppMode.RESTAPI) {
                this.doRestData(ele);
            }
            else {
                this.addResponse(ele.getResponse());
            }
            this.doUserAdmin(ele);
            yield this.doElementAdmin(ele);
        });
    }
    doElementAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getElements" in ele) {
                const elements = ele.getElements();
                if (!Array.isArray(elements)) {
                    return false;
                }
                for (const element of elements) {
                    yield this.setElement(element);
                }
            }
        });
    }
    doUserAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getUserInfo" in ele) {
                const info = ele.getUserInfo();
                if (info.auth) {
                    const token = this.authorization.setAuth(info);
                    this.addResponse([
                        {
                            mode: "auth",
                            props: { token },
                        },
                    ]);
                    //token := whendy.Store.User.Set(info)
                    //whendy.w.Header().Set("Authorization", token)
                }
            }
        });
    }
    doRestData(ele) {
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
    constructor(opt) {
        this.port = 8080;
        this.classElement = [];
        this.constants = {};
        this.header = {};
        //private authorization:authorization;
        this.useModule = true;
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
        http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (req.method.toLocaleUpperCase() == "OPTIONS") {
                res.writeHead(204, this.header);
                res.end();
                return;
            }
            const session = manager.start(req, res);
            session.loadSession(this.constants);
            let infoDB = this.db;
            let init = this.init;
            if (this.useModule) {
                const moduleInfo = Tool.loadJsonFile(`./modules${req.url}/config.json`);
                session.loadSession(moduleInfo.constants || {});
                infoDB = moduleInfo.db || [];
                init = moduleInfo.init;
                //console.log("-> ", req.url, path.dirname(req.url));
                //console.log(url.parse(req.url));
            }
            const db = new DBAdmin();
            db.init(infoDB);
            const wh = new Whendy();
            wh.authorization = new Authorization();
            wh.authorization.evalHeader(req, res);
            const store = new Store();
            store.setSessionAdmin(session);
            store.setDBAdmin(db);
            yield store.start(req, res);
            wh.store = store;
            if (store.getReq("__app_store")) {
                session.loadSession(store.getReq("__app_store"));
            }
            const start = (_a = wh.store.getHeader("Application-Name")) === null || _a === void 0 ? void 0 : _a.toString();
            console.log("init", start, init);
            if (start && init[start]) {
                console.log("START");
                wh.setStart(init[start]);
            }
            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            res.write(yield wh.render());
            res.end();
        })).listen(this.port);
    }
    getModuleName(url) { }
}
export class Socket {
    constructor(opt) {
        this.port = 8088;
        this.classElement = [];
        this.constants = {};
        this.header = {};
        this.useModule = true;
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
        const wss = new WebSocketServer({ port: +this.websocket.port || this.port });
        wss.on("connection", (ws, req) => __awaiter(this, void 0, void 0, function* () {
            const wh = new Whendy();
            let infoDB = this.db;
            let start = this.init;
            ws.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { body, mode, token, applicationName } = JSON.parse(data.toString());
                if (mode === "auth" || ((_a = this.websocket.roles) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                    const auth = new Authorization();
                    auth.verify(token);
                    if (((_b = this.websocket.roles) === null || _b === void 0 ? void 0 : _b.length) > 0 && !auth.validRoles(this.websocket.roles)) {
                        ws.send("user don't authorized");
                        ws.close();
                    }
                    const store = new Store();
                    const session = manager.create("sessionId");
                    if (this.useModule) {
                        const moduleInfo = Tool.loadJsonFile(`./modules${req.url}/config.json`);
                        session.loadSession(moduleInfo.constants || {});
                        infoDB = moduleInfo.db || [];
                        start = moduleInfo.start;
                        //console.log("-> ", req.url, path.dirname(req.url));
                        //console.log(url.parse(req.url));
                    }
                    session.loadSession(this.constants);
                    const db = new DBAdmin();
                    db.init(infoDB);
                    store.setSessionAdmin(session);
                    store.setDBAdmin(db);
                    //await store.start(null, null);
                    wh.authorization = auth;
                    wh.store = store;
                }
                wh.store.setVReq(body || {});
                if (applicationName) {
                    console.log("START");
                    wh.setStart(start);
                }
                const result = yield wh.render();
                ws.send(result);
            }));
            ws.on("close", (params) => __awaiter(this, void 0, void 0, function* () {
                console.log("cerrando");
            }));
            ws.on("error", (err) => {
                console.log("error", err);
            });
        }));
    }
}
export class Server1 extends http.Server {
    constructor(opt) {
        super();
        this.port = 8080;
        this.cookies = [];
        this.header = {};
        this.classElement = [];
        this.output = [];
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
        this.on("request", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            yield store.start(req, res);
            this.store = store;
            /*for (const [key, value] of Object.entries(this.header)) {
               res.setHeader(key, value);
            }*/
            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            res.write(yield this.render());
            res.end();
        }));
    }
    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    start() {
        this.listen(this.port);
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.output = [];
            this.mode = this.store.getHeader("Application-Mode").toString();
            if (this.mode === "start") {
                yield this.setElement(this.setApp);
            }
            let request = this.store.getReq("__app_request");
            if (request) {
                if (typeof request === "string") {
                    request = JSON.parse(request);
                }
                yield this.evalRequest(request);
            }
            if (this.mode === "restapi") {
                return JSON.stringify(this.restData);
            }
            return JSON.stringify(this.output);
        });
    }
    addResponse(response) {
        this.output = [...this.output, ...response];
    }
    evalRequest(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let request of requests) {
                yield this.evalCommand(request);
            }
        });
    }
    evalCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (command.type) {
                case "init":
                    yield this.setElement(command);
                case "element":
                    yield this.setElement(command);
                case "update":
                default:
            }
        });
    }
    setElement(info) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.setExp("ID_", info.id);
            this.store.setExp("ELEMENT_", info.element);
            //this.store.LoadExp(info.eparams)
            const cls = yield classManager.getClass(info.element);
            if (!cls) {
                console.log("error, clas not found");
                return;
            }
            const ele = new cls();
            ele.setStore(this.store);
            ele.init(info);
            yield ele.evalMethod(info.method);
            if (this.mode == "restapi") {
                this.doRestData(ele);
            }
            else {
                this.addResponse(ele.getResponse());
            }
            this.doUserAdmin(ele);
            yield this.doElementAdmin(ele);
        });
    }
    doElementAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getElements" in ele) {
                const elements = ele.getElements();
                if (!Array.isArray(elements)) {
                    return false;
                }
                for (const element of elements) {
                    yield this.setElement(element);
                }
            }
        });
    }
    doUserAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getUserInfo" in ele) {
                const info = ele.getUserInfo();
                if (info.auth) {
                    const token = this.authorization.setAuth(info);
                    this.addResponse([
                        {
                            mode: "auth",
                            props: { token },
                        },
                    ]);
                    //token := whendy.Store.User.Set(info)
                    //whendy.w.Header().Set("Authorization", token)
                }
            }
        });
    }
    doRestData(ele) {
        if ("getRestData" in ele) {
            this.setRestData(ele.getRestData());
        }
    }
    setRestData(data) {
        this.restData = data;
    }
}
//# sourceMappingURL=whendy.js.map