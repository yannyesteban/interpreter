import { cookieParse } from "./CookieHandler.js";
import { Outer } from "./../core/outer/Outer.js";
import { loadFile } from "./tool.js";
export class Store {
    constructor() {
        this.vexp = {};
        this.vreq = {};
        this.vses = {};
        this.qpar = {};
        this.outer = new Outer();
    }
    setSessionAdmin(session) {
        this.session = session;
    }
    setDBAdmin(db) {
        this.db = db;
    }
    start(req, res) {
        this.request = req;
        this.response = res;
        //this.outer = new Outer();
        return new Promise((resolve, reject) => {
            var _a;
            try {
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
                        }
                        else if (contentType == "application/x-www-form-urlencoded") {
                            this.queryParams(new URLSearchParams(postData));
                            this.vreq = Object.assign(Object.assign({}, this.vreq), this.qpar);
                        }
                        else if (contentType.includes("multipart/form-data")) {
                            //throw "multipart/form-data";
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
            }
            catch (e) {
                reject(e);
            }
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
    getVReq() {
        return this.vreq;
    }
    setVReq(vreq) {
        this.vreq = vreq;
    }
    getReq(name) {
        return this.vreq[name];
    }
    setReq(name, value) {
        this.vreq[name] = value;
    }
    getVSes() {
        return this.session.data;
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
    eval(template) {
        this.outer.resetData();
        this.outer.setMap("@", this.session.getData(), "");
        this.outer.setMap("&", this.vexp, "");
        this.outer.setMap("#", this.vreq, "");
        return this.outer.execute(template);
    }
    evalSubData(template, data) {
        this.outer.resetData();
        this.outer.setMap("&", data, "");
        return this.outer.execute(template);
    }
}
//# sourceMappingURL=store.js.map