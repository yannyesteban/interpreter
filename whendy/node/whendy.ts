import * as http from "http"
import { register, Manager } from "./manager.js"
import { cookieParse, CookieVar } from "./CookieHandler.js";
import { Store, test } from "./store.js";
import { Memory } from "./memory.js";
import { InfoElement } from "./element.js"; 


export class Whendy extends http.Server {

    private port = 8080;

    private session;
    store: Store;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies: CookieVar[] = [];

    header:{[key:string]:string | number } = {};

    setApp: InfoElement;

    output :[] = [];
    constructor(opt:object) {
        
        //console.log("TEST ", opt);


        super();

        for (const [key, value] of Object.entries(opt)) {
            this[key] = value;
        }

        register("memory", Memory)

        let manager = new Manager({
            cookieName: "whsessionid", machineType: "memory", maxLifeTime: 36000
        });


        this.on('request', async (req: http.IncomingMessage, res: http.ServerResponse) => {

            if(req.method.toLocaleUpperCase() == "OPTIONS"){
                res.writeHead(204, this.header);
                res.end();
                return;
            }
            

            console.log("Method:", req.method);

            

            const session = manager.start(req, res);
            const store = new Store(session);
            await store.start(req, res);
            console.log("Method11:", req.method);

            this.store = store;
            //res.appendHeader('Set-Cookie', ["k2002=cuarentena2"]);

            console.log("ok", store.getReq("agua"))

            for (const [key, value] of Object.entries(this.header)) {
               //res.setHeader(key, value);
            }
            
            
            res.writeHead(200, this.header);//{ 'Content-Type': 'application/json' }
            res.write(this.render());

            res.end();
        });
    }

    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    public start() {
        console.log(this.port)
        this.listen(this.port)
    }

    render(){


        let request = this.store.getReq("__app_request");
        if(request){
            if(typeof request === "string"){
                request = JSON.parse(request);
            }
            this.evalRequest(request);
        }
        
        return `[{"name":"Yanny", "lastname":"Nuñez"}]`;
    }

    evalRequest(requests:[]) {

        requests.forEach(request=>{
            this.evalCommand(request);
        });

    }
    
    evalCommand(command) {
    
        //$command = Tool::toJson($command);
    
        switch (command.Type) {
    
        case "init":
            this.setElement(command)
    
        case "element":
            this.setElement(command)
    
        case "update":
    
        default:
    
        }
    }


    setElement(opt?){

    }
}