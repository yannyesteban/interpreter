import { WebSocketServer } from "ws";
import { register, Manager } from "./manager.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { InfoElement } from "./element.js";
import * as classManager from "./classManager.js";
import { IConnectInfo } from "./dataModel.js";
import { Authorization } from "./Authorization.js";
import { DBAdmin } from "./db/dbAdmin.js";
import { Tool } from "./tool.js";
import { InfoClass, Whendy } from "./whendy.js";

export class Socket {
    private port = 8088;
    private classElement: InfoClass[] = [];
    private constants: { [key: string]: any } = {};
    private header: { [key: string]: string | number } = {};

    private websocket: { port: string; roles: string[] };
    private db: IConnectInfo[];
    private apps: { [name: string]: InfoElement };

    useModule: boolean = true;
    init: any;
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

        const wss = new WebSocketServer({ port: +this.websocket.port || this.port });

        wss.on("connection", async (ws, req) => {
            const wh = new Whendy();
            let infoDB = this.db;
            let start = this.init;
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

                const result = await wh.render();

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
