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
import { Session, Machine } from "./session.js";
import { cookieParse } from "./CookieHandler.js";
import { Store } from "./store.js";
export class Whendy extends http.Server {
    constructor(opt) {
        super((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            this.request = req;
            this.response = res;
            console.clear();
            console.log(req.method.toUpperCase(), "\n\n", (_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie);
            const store = new Store();
            yield store.start(req, res);
            Session.start(req, res);
            console.log("REQ:", store.vreq);
            res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            //res.setHeader("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id")
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE");
            console.log((_b = req.headers) === null || _b === void 0 ? void 0 : _b.cookie);
            let coo = ((_c = req.headers) === null || _c === void 0 ? void 0 : _c.cookie) || "";
            res.write(`{"a":"yanny", "b":"${coo}"}`);
            //res.write(ct)
            console.log("ooooooooooooooo\nxxxxxxxxxxxxx\noooooo");
            res.end(); //end the response
        }));
        this.port = 8080;
        this.cookies = [];
        for (const x in opt) {
            this[x] = opt[x];
        }
        Session.register("memory", Machine);
        this.session = Session.create(this.session);
    }
    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    start() {
        console.log(this.port);
        this.listen(this.port);
    }
    startCookies() {
        var _a;
        this.cookies = cookieParse((_a = this.request.headers) === null || _a === void 0 ? void 0 : _a.cookie);
    }
}
//# sourceMappingURL=whendy.js.map