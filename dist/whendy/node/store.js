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
import { Outer } from "./../../core/outer/Outer.js";
import { loadFile } from "./tool.js";
export class Store {
    constructor() {
        this.vexp = {};
        this.vreq = {};
        this.vses = {};
        this.qpar = {};
    }
    setSessionAdmin(session) {
        this.session = session;
    }
    setDBAdmin(db) {
        this.db = db;
    }
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.request = req;
            this.response = res;
            this.outer = new Outer();
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
                        const postData = Buffer.concat(chunks).toString();
                        if (contentType == "application/json") {
                            this.vreq = Object.assign(Object.assign({}, this.vreq), JSON.parse(postData));
                            console.log(this.vreq);
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
                    this.vreq = Object.assign(Object.assign({}, this.vreq), this.qpar);
                    resolve(true);
                }
                else {
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
    getExp(name) {
        return this.vexp[name];
    }
    setExp(name, value) {
        this.vexp[name] = value;
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
    getHeader(key) {
        return this.request.headers[key.toLowerCase()] || undefined;
    }
    loadFile(name) {
        let file = loadFile(name);
        this.outer.resetData();
        this.outer.setMap("@", this.session.getData(), "");
        this.outer.setMap("&", this.vexp, "");
        this.outer.setMap("#", this.vreq, "");
        return this.outer.execute(file);
    }
    loadJsonFile(name) {
        if (!name) {
            return null;
        }
        let file = this.loadFile(name);
        return JSON.parse(this.outer.execute(file));
    }
}
//# sourceMappingURL=store.js.map