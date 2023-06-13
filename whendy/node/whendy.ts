import * as http from "http"
import { Session, Machine } from "./session.js"
import { cookieParse, CookieVar } from "./CookieHandler.js";
import { Store } from "./store.js";


export class Whendy extends http.Server {

    private port = 8080;

    private session;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies:CookieVar[] = [];
    
    constructor(opt) {



        super(async (req, res) => {
            this.request = req;
            this.response = res;
            console.clear();
            
            console.log(req.method.toUpperCase(), "\n\n", req.headers?.cookie)
            const store = new Store();
            await store.start(req, res);
            Session.start(req, res);


            console.log("REQ:",store.vreq)
            

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