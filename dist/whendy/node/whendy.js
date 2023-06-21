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
export class Whendy extends http.Server {
    constructor(opt) {
        //console.log("TEST ", opt);
        super();
        this.port = 8080;
        this.cookies = [];
        this.header = {};
        this.output = [];
        for (const [key, value] of Object.entries(opt)) {
            this[key] = value;
        }
        register("memory", Memory);
        let manager = new Manager({
            cookieName: "whsessionid", machineType: "memory", maxLifeTime: 36000
        });
        this.on('request', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.method.toLocaleUpperCase() == "OPTIONS") {
                res.writeHead(204, this.header);
                res.end();
                return;
            }
            console.log("Method:", req.method);
            const session = manager.start(req, res);
            const store = new Store(session);
            yield store.start(req, res);
            console.log("Method11:", req.method);
            this.store = store;
            //res.appendHeader('Set-Cookie', ["k2002=cuarentena2"]);
            console.log("ok", store.getReq("agua"));
            for (const [key, value] of Object.entries(this.header)) {
                //res.setHeader(key, value);
            }
            res.writeHead(200, this.header); //{ 'Content-Type': 'application/json' }
            res.write(this.render());
            res.end();
        }));
    }
    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    start() {
        console.log(this.port);
        this.listen(this.port);
    }
    render() {
        let request = this.store.getReq("__app_request");
        if (request) {
            if (typeof request === "string") {
                request = JSON.parse(request);
            }
            this.evalRequest(request);
        }
        return `[{"name":"Yanny", "lastname":"Nuñez"}]`;
    }
    evalRequest(requests) {
        requests.forEach(request => {
            this.evalCommand(request);
        });
    }
    evalCommand(command) {
        //$command = Tool::toJson($command);
        switch (command.Type) {
            case "init":
                this.setElement(command);
            case "element":
                this.setElement(command);
            case "update":
            default:
        }
    }
    setElement(opt) {
    }
}
//# sourceMappingURL=whendy.js.map