import * as http from "http";
import * as queryString from "node:querystring";
import { cookieParse } from "./CookieHandler.js";
import { ISession } from "./manager.js";

import { Outer } from "./../core/outer/Outer.js";
import { Logic } from "./../core/Logic.js";
import { loadFile, loadJsonFile } from "./tool.js";
import { DBAdmin } from "./db/dbAdmin.js";

export class Store {
    public vexp: { [id: string]: any } = {};
    public vreq: { [id: string]: any } = {};
    public vses: { [id: string]: any } = {};
    public qpar: { [id: string]: any } = {};

    header;
    cookie;
    session: ISession;
    db: DBAdmin;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    outer: Outer = new Outer();

    setSessionAdmin(session) {
        this.session = session;
    }

    setDBAdmin(db) {
        this.db = db;
    }

    start(req: http.IncomingMessage, res: http.ServerResponse) {
        this.request = req;
        this.response = res;
        //this.outer = new Outer();

        return new Promise((resolve, reject) => {
            try {
                this.cookie = cookieParse(req.headers?.cookie);

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
                            this.vreq = { ...this.vreq, ...JSON.parse(postData) };
                            
                        } else if (contentType == "application/x-www-form-urlencoded") {
                            this.queryParams(new URLSearchParams(postData));

                            this.vreq = { ...this.vreq, ...this.qpar };
                        } else if (contentType.includes("multipart/form-data")) {
                            //throw "multipart/form-data";
                        }

                        resolve(true);
                    });
                } else if (req.method.toUpperCase() == "GET") {
                    this.vreq = { ...this.vreq, ...this.qpar };
                    resolve(true);
                } else {
                    resolve(true);
                }
            } catch (e) {
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

    getSes(key) {
        return this.session.get(key);
    }

    setSes(key, value) {
        return this.session.set(key, value);
    }

    getHeader(key: string) {
        return this.request.headers[key.toLowerCase()] || undefined;
    }

    loadFile(name: string) {
        let file = loadFile(name);
        this.outer.resetData();
        this.outer.setMap("@", this.session.getData(), "");
        this.outer.setMap("&", this.vexp, "");
        this.outer.setMap("#", this.vreq, "");

        return this.outer.execute(file);
    }

    loadJsonFile(name: string) {
        if (!name) {
            return null;
        }

        let file = this.loadFile(name);
        return JSON.parse(this.outer.execute(file));
    }


    eval(template: string) {
        
        this.outer.resetData();
        this.outer.setMap("@", this.session.getData(), "");
        this.outer.setMap("&", this.vexp, "");
        this.outer.setMap("#", this.vreq, "");

        return this.outer.execute(template);
    }

    evalSubData(template: string, data:any) {
        
        this.outer.resetData();
        
        this.outer.setMap("&", data, "");
        

        return this.outer.execute(template);
    }
}
