import * as http from "http";
import * as queryString from "node:querystring";
import { cookieParse } from "./CookieHandler.js";
import { ISession } from "./manager.js";
//import { Session, Machine } from "./manager.js"

export var test = 5;



export class Store {


    public vreq: { [id: string]: any } = {};
    public vses: { [id: string]: any } = {};
    public qpar: { [id: string]: any } = {};

    header;
    cookie;
    session: ISession;

    request: http.IncomingMessage;
    response: http.ServerResponse;
    
    constructor(session) {
        this.session = session
    }
    async start(req: http.IncomingMessage, res: http.ServerResponse) {

        this.request = req;
        this.response = res;

        return new Promise((resolve, reject)=>{

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
                    console.log("POST ..")
                    const postData = Buffer.concat(chunks).toString();
                    
                    if (contentType == "application/json") {
                       
                        this.vreq = { ...this.vreq, ...JSON.parse(postData) };

                       
                    } else if (contentType == "application/x-www-form-urlencoded") {
                       
                        this.queryParams(new URLSearchParams(postData));

                        this.vreq = { ...this.vreq, ...this.qpar };
                    } else if (contentType.includes("multipart/form-data")) {
                        throw "multipart/form-data";
                    }

                    resolve(true)
    
                });
            } else if (req.method.toUpperCase() == "GET") {
                //let [, param] = req.url.split("?");
                //this.queryParams(new URLSearchParams(param));
                this.vreq = {...this.vreq, ...this.qpar}
                resolve(true);
            } else{
                resolve(true);
            }
        })
    }

    queryParams(data) {

        for (const [key, value] of data) {
            this.qpar[key] = value;
        }
    }

    getCookie(name){
        return this.cookie[name];
    }

    setCookie(name, value){
        this.cookie[name] = value;
    }

    getReq(name){
        return this.vreq[name];
    }

    setReq(name, value){
        this.vreq[name] = value;
    }

    getSes(key){
        return this.session.get(key);
    }

    setSes(key, value){
        return this.session.set(key, value);
    }
}