import * as http from "http";
import { Session, Machine } from "./session.js";
import { cookieParse } from "./CookieHandler.js";
export class Whendy extends http.Server {
    constructor(opt) {
        super((req, res) => {
            var _a, _b, _c;
            this.request = req;
            this.response = res;
            console.clear();
            console.log(req.method.toUpperCase(), "\n\n", (_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie);
            Session.start(req, res);
            let data = null;
            let ct = req.headers["content-type"] || "";
            if (req.method.toUpperCase() == "POST") {
                console.log("POST");
                //res.write(req.headers["content-type"])
                //Content-Type
                //          application/x-www-form-urlencoded
                const chunks = [];
                const postData = null;
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    console.log("all parts/chunks have arrived");
                    const postData = Buffer.concat(chunks).toString();
                    console.log("Data: ", postData, "\n\n");
                    if (ct == "application/json") {
                        data = JSON.parse(postData);
                    }
                    else if (ct == "application/x-www-form-urlencoded") {
                        const parsedData = new URLSearchParams(postData);
                        data = {};
                        console.log(parsedData);
                        for (const [key, value] of parsedData) {
                            data[key] = value;
                        }
                        console.log("DataObj: ", data);
                    }
                });
            }
            else if (req.method.toUpperCase() == "GET") {
                let [, param] = req.url.split("?");
                const parsedData = new URLSearchParams(param);
                console.log("GET", parsedData);
            }
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
        });
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