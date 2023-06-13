import * as http from "http";
import * as queryString from "node:querystring";
import { cookieParse, CookieVar } from "./CookieHandler.js";

export class Store {


    public vreq: { [id: string]: any } = {};
    public vses: { [id: string]: any } = {};

    header;
    cookie;
    constructor() {

    }
    async start(req: http.IncomingMessage, res: http.ServerResponse) {

        return new Promise((resolve, reject)=>{

            this.cookie = cookieParse(req.headers?.cookie);

            const method = req.method.toUpperCase();
            const contentType = req.headers["content-type"] || "";
    
            let ct = req.headers["content-type"] || "";
            if (method == "POST") {
    
    
                console.log("POST")
                //res.write(req.headers["content-type"])
                //Content-Type
                //          application/x-www-form-urlencoded
                const chunks = [];
    
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    console.log("all parts/chunks have arrived", `--${contentType}--`);
                    const postData = Buffer.concat(chunks).toString();
                    console.log("Data: ", postData, "\n\n");
                    if (contentType == "application/json") {
                        this.vreq = { ...this.vreq, ...JSON.parse(postData) };
                    } else if (contentType == "application/x-www-form-urlencoded") {
                        console.log("88888", queryString.decode(postData))
                        this.queryParams(new URLSearchParams(postData));
                    } else if (contentType.includes("multipart/form-data")) {
                        throw "multipart/form-data";
                    }

                    resolve(true)
    
                });
            } else if (req.method.toUpperCase() == "GET") {
                let [, param] = req.url.split("?");
                this.queryParams(new URLSearchParams(param));
                resolve(true);
            } 
        })
        
    }

    queryParams(data) {


        for (const [key, value] of data) {
            this.vreq[key] = value;
        }

        console.log("9999", this.vreq)
    }
}