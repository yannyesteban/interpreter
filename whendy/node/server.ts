import * as http from "http";
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

export class Server {
    private port = 8080;
    private classElement: InfoClass[] = [];
    private constants: { [key: string]: any } = {};
    private header: { [key: string]: string | number } = {};

    private db: IConnectInfo[];
    private setApp: InfoElement;
    private apps: { [name: string]: InfoElement };
    //private authorization:authorization;

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

        http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
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
            await store.start(req, res);

            wh.store = store;

            if (store.getReq("__app_store")) {
                session.loadSession(store.getReq("__app_store"));
            }

            const start = wh.store.getHeader("Application-Name")?.toString();
            console.log("init", start, init);
            if (start && init[start]) {
                console.log("START");
                wh.setStart(init[start]);
            }

            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }

            res.write(await wh.render());

            res.end();
        }).listen(this.port);
    }
    private getModuleName(url) {}
}
