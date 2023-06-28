import * as http from "http"
import { register, Manager } from "./manager.js"
import { CookieVar } from "./CookieHandler.js";
import { Store } from "./store.js";
import { Memory } from "./memory.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin } from "./element.js";
import * as classManager from "./classManager.js";

interface InfoClass {
    "name": string;
    "enable": boolean;
    "file": string;
    "class": string;

}

export class Whendy extends http.Server {

    private port = 8080;

    private session;
    store: Store;

    request: http.IncomingMessage;
    response: http.ServerResponse;

    cookies: CookieVar[] = [];

    header: { [key: string]: string | number } = {};

    setApp: InfoElement;
    constants;
    classElement: InfoClass[] = [];

    output: InfoElement[] = [];
    private endData:any;
    constructor(opt: object) {

        super();

        for (const [key, value] of Object.entries(opt)) {
            this[key] = value;
        }

        register("memory", Memory);
        classManager.register(this.classElement);

        let manager = new Manager({
            cookieName: "whsessionid", machineType: "memory", maxLifeTime: 36000
        });

        this.on('request', async (req: http.IncomingMessage, res: http.ServerResponse) => {

            if (req.method.toLocaleUpperCase() == "OPTIONS") {
                res.writeHead(204, this.header);
                res.end();
                return;
            }

            const session = manager.start(req, res);
            session.loadSession(this.constants);

            const store = new Store(session);
            await store.start(req, res);

            this.store = store;

            /*for (const [key, value] of Object.entries(this.header)) {
               res.setHeader(key, value);
            }*/

            res.writeHead(200, this.header);//{ 'Content-Type': 'application/json' }
            res.write(await this.render());

            res.end();
        });
    }

    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

    public start() {
        this.listen(this.port)
    }

    async render() {

        this.output = [];

        if ((this.store.getHeader("Application-Mode") || "") === "start") {
            console.log("START")
            await this.setElement(this.setApp)
        }

        let request = this.store.getReq("__app_request");

        if (request) {
            if (typeof request === "string") {
                request = JSON.parse(request);
            }
            
            await this.evalRequest(request);
            
        }

        return JSON.stringify(this.output);
    }

    addResponse(response: InfoElement[]) {
        this.output = [...this.output, ...response];
    }

    async evalRequest(requests: []) {

        for(let request of requests){
            await this.evalCommand(request);
        }
    }

    async evalCommand(command) {

        switch (command.type) {

            case "init":
                await this.setElement(command)

            case "element":
                console.log(command)
                await this.setElement(command)

            case "update":

            default:

        }
    }

    async setElement(info: InfoElement) {

        this.store.setExp("ID_", info.id);
        this.store.setExp("ELEMENT_", info.element);
        //this.store.LoadExp(info.eparams)

        const cls = await classManager.getClass(info.element);

        if(!cls){
            console.log("error, clas not found");
            return;
        }

        const ele: Element = new cls();

        ele.setStore(this.store);
        ele.init(info);
        ele.evalMethod(info.method);

        this.addResponse(ele.getResponse())
        this.doEndData(ele);
        this.doUserAdmin(ele)
        await this.doElementAdmin(ele);
    }

    async doElementAdmin(ele: IElementAdmin | Element) {

        if ("getElements" in ele) {

            const elements = ele.getElements();
            if (!Array.isArray(elements)) {
                return false;
            }

            for (const element of elements) {
                await this.setElement(element);
            };
        }
    }

    async doUserAdmin(ele: IUserAdmin | Element){
        if ("getUserInfo" in ele) {

            const info = ele.getUserInfo();

            if (info.user != "") {
                //token := whendy.Store.User.Set(info)
                //whendy.w.Header().Set("Authorization", token)
                
            }
        }
    }

    doEndData(ele: IRestElement | Element){
        
        if("getEndData" in ele){
            this.setEndData(ele.getEndData());
        }

    }
    
    setEndData(endData) {
        this.endData = endData;
    }
}
