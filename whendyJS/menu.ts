import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";

export class Menu extends Element{

    public id:string;
    public name: string;
    public element:string =   "wh-html";
    public className : string | string [];
    public setPanel:string;
    public appendTo: string;
    response: object = {};

    templateFile: string;
    
    

    store:Store = null;

    _config:any = {};

    setStore(store:Store){
        this.store = store;
    }
    
    init(info:InfoElement){
        this._config = info
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
        
    }

    async evalMethod(method: string){
        
        switch(method){
            case "load":
                await this.load();
                break;
        }
    }

    async load(){

        this.response = {
            element: "menu",
            propertys: {
                dataSource: this._config,
                
                
            },
        };
    }
    
    getResponse(): any {
        return this.response;
    }

    addResponse(response) {
        //this.response.push(response);
    }
}
