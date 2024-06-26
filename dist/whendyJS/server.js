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
import { register, Manager } from "./manager.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { ClassManager } from "./classManager.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";
import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";
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
        const classManager = new ClassManager(this.classElement);
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
                console.log(req.url);
                const moduleInfo = Tool.loadJsonFile(`./app/modules${req.url}/config.json`);
                session.loadSession(moduleInfo.constants || {});
                infoDB = moduleInfo.db || [];
                init = moduleInfo.init;
                //console.log("-> ", req.url, path.dirname(req.url));
                //console.log(url.parse(req.url));
            }
            const db = new DBAdmin();
            db.init(infoDB);
            const wh = new Whendy();
            wh.classes = classManager;
            wh.authorization = new Authorization();
            wh.authorization.evalHeader(req, res);
            const store = new Store();
            store.setSessionAdmin(session);
            store.setDBAdmin(db);
            yield store.start(req, res);
            wh.store = store;
            const appStore = store.getReq("__app_store");
            let appRequest = store.getReq("__app_request");
            if (typeof appRequest === "string") {
                appRequest = JSON.parse(appRequest);
            }
            if (appStore) {
                session.loadSession(appStore);
            }
            const start = (_a = wh.store.getHeader("Application-Name")) === null || _a === void 0 ? void 0 : _a.toString();
            if (start && init[start]) {
                appRequest = init[start];
            }
            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            const result = [
                Object.assign({}, store.getReq("__app_store")),
                {
                    type: "store",
                    name: "unit",
                    data: "test",
                },
                {
                    type: "storeData",
                    data: { test: "hola" },
                },
                {
                    a: 4,
                },
                {
                    type: "element",
                    id: "x",
                    data: {
                        innerHTML: "hello",
                    },
                    appendTo: "#y",
                },
                {
                    type: "set",
                    data: {
                        element: "form",
                        propertys: {
                            dataSource: {
                                title: "hello World!",
                            },
                        },
                    },
                    id: "x",
                    setpanel: "p4",
                    appendTo: "#y",
                },
                {
                    type: "panel",
                    panel: "p4",
                    element: "form",
                    id: "users",
                    propertys: {
                        dataSource: { g: "NOW" },
                    },
                },
                {
                    type: "log",
                    data: {
                        a: "one",
                    },
                },
                {
                    type: "error",
                    data: {
                        message: "error",
                    },
                },
                {
                    type: "property",
                    id: "k",
                    property: "dataSource",
                    data: {
                        name: "yanny",
                    },
                },
            ];
            //res.write(JSON.stringify(result));
            //console.log(appRequest);
            res.write(yield wh.render(appRequest));
            res.end();
        })).listen(this.port);
    }
    getModuleName(url) { }
}
//# sourceMappingURL=server.js.map