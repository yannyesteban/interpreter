var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cookieParse } from "./CookieHandler.js";
//import { Session, Machine } from "./manager.js"
export class Store {
    constructor(session) {
        this.vreq = {};
        this.vses = {};
        this.qpar = {};
        this.session = session;
    }
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.request = req;
            this.response = res;
            return new Promise((resolve, reject) => {
                var _a;
                this.cookie = cookieParse((_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie);
                const method = req.method.toUpperCase();
                const contentType = req.headers["content-type"] || "";
                let [, param] = req.url.split("?");
                this.queryParams(new URLSearchParams(param));
                if (method == "POST") {
                    const chunks = [];
                    req.on("data", (chunk) => {
                        chunks.push(chunk);
                    });
                    req.on("end", () => {
                        console.log("POST ..");
                        const postData = Buffer.concat(chunks).toString();
                        if (contentType == "application/json") {
                            this.vreq = Object.assign(Object.assign({}, this.vreq), JSON.parse(postData));
                        }
                        else if (contentType == "application/x-www-form-urlencoded") {
                            this.queryParams(new URLSearchParams(postData));
                            this.vreq = Object.assign(Object.assign({}, this.vreq), this.qpar);
                        }
                        else if (contentType.includes("multipart/form-data")) {
                            throw "multipart/form-data";
                        }
                        resolve(true);
                    });
                }
                else if (req.method.toUpperCase() == "GET") {
                    //let [, param] = req.url.split("?");
                    //this.queryParams(new URLSearchParams(param));
                    this.vreq = Object.assign(Object.assign({}, this.vreq), this.qpar);
                    resolve(true);
                }
            });
        });
    }
    queryParams(data) {
        for (const [key, value] of data) {
            this.qpar[key] = value;
        }
    }
    getCookie(name) {
        return this.cookie[name];
    }
    setCookie(name, value) {
        this.cookie[name] = value;
    }
    getReq(name) {
        return this.vreq[name];
    }
    setReq(name, value) {
        this.vreq[name] = value;
    }
    getSes(key) {
        return this.session.get(key);
    }
    setSes(key, value) {
        return this.session.set(key, value);
    }
}
//# sourceMappingURL=store.js.map