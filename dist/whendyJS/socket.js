var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebSocketServer } from "ws";
import { register, Manager } from "./manager.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { ClassManager } from "./classManager.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";
import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";
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
        const classManager = new ClassManager(this.classElement);
        let manager = new Manager({
            cookieName: "whsessionid",
            machineType: "memory",
            maxLifeTime: 36000,
        });
        const wss = new WebSocketServer({ port: +this.websocket.port || this.port });
        wss.on("connection", (ws, req) => __awaiter(this, void 0, void 0, function* () {
            const wh = new Whendy();
            wh.classes = classManager;
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
                const result = yield wh.render({});
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
//# sourceMappingURL=socket.js.map