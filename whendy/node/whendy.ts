import * as http from "http"
import { Session, Machine } from "./session.js"
import { cookieParse, CookieVar } from "./CookieHandler.js";


export class Whendy extends http.Server {

    private port = 8080;

    private session;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies:CookieVar[] = [];
    
    constructor(opt) {



        super((req, res) => {
            this.request = req;
            this.response = res;
            console.clear();
            
            console.log(req.method.toUpperCase(), "\n\n", req.headers?.cookie)
            Session.start(req, res);


            let data = null;
            let ct = req.headers["content-type"] || "";
            if (req.method.toUpperCase() == "POST") {


                console.log("POST")
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
                    } else
                        if (ct == "application/x-www-form-urlencoded") {
                            const parsedData = new URLSearchParams(postData);
                            data = {};
                            console.log(parsedData)

                            for (const [key, value] of parsedData) {
                                data[key] = value;
                            }
                            console.log("DataObj: ", data);

                        }


                });
            } else if (req.method.toUpperCase() == "GET") {
                let [, param] = req.url.split("?");
                const parsedData = new URLSearchParams(param);
                console.log("GET", parsedData)

            }

            res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
            res.setHeader("Access-Control-Allow-Credentials", "true");

            //res.setHeader("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id")
            res.setHeader("Access-Control-Allow-Headers", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
            res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE")

            console.log(req.headers?.cookie)

            let coo = req.headers?.cookie || "";
            res.write(`{"a":"yanny", "b":"${coo}"}`)
            //res.write(ct)


            
            console.log("ooooooooooooooo\nxxxxxxxxxxxxx\noooooo")
            res.end(); //end the response

        });
        for (const x in opt) {
            this[x] = opt[x];
        }

        
        Session.register("memory", Machine);

        this.session = Session.create(this.session);




    }

    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    public start() {
        console.log(this.port)
        this.listen(this.port)
    }

    private startCookies(){
        this.cookies = cookieParse(this.request.headers?.cookie);
    }
}