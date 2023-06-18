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
        super();
        this.port = 8080;
        this.cookies = [];
        register("memory", Memory);
        let manager = new Manager({
            cookieName: "whsessionid", machineType: "memory", maxLifeTime: 36000
        });
        this.on('request', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = manager.start(req, res);
            const store = new Store(session);
            yield store.start(req, res);
            //res.appendHeader('Set-Cookie', ["k2002=cuarentena2"]);
            console.log("ä", store.getReq("agua"));
            res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            //res.setHeader("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id")
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE");
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Hello, World!');
            res.end();
        }));
    }
    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    start() {
        console.log(this.port);
        this.listen(this.port);
    }
}
//# sourceMappingURL=whendy.js.map