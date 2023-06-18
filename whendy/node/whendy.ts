import * as http from "http"
import { register, Manager } from "./manager.js"
import { cookieParse, CookieVar } from "./CookieHandler.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";


export class Whendy extends http.Server {

    private port = 8080;

    private session;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies: CookieVar[] = [];

    constructor(opt) {

        super();

        register("memory", Memory)

        let manager = new Manager({
            cookieName: "whsessionid", machineType: "memory", maxLifeTime: 36000
        });


        this.on('request', async (req: http.IncomingMessage, res: http.ServerResponse) => {

            const session = manager.start(req, res);
            const store = new Store(session);
            await store.start(req, res);



            //res.appendHeader('Set-Cookie', ["k2002=cuarentena2"]);


            console.log("ä", store.getReq("agua"))


            res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            //res.setHeader("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id")
            res.setHeader("Access-Control-Allow-Headers", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
            res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE")



            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Hello, World!');

            res.end();
        });
    }

    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    public start() {
        console.log(this.port)
        this.listen(this.port)
    }


}