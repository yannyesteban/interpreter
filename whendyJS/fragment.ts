import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";

export class Fragment extends Element{

    public id:string;
    public name: string;
    public element:string =   "wh-html";
    public className : string | string [];
    public setPanel:string;
    public appendTo: string;
    
    templateFile: string;
    
    response:object = {};

    store:Store = null;

    setStore(store:Store){
        this.store = store;
    }
    
    init(info:InfoElement){

        const config = this.store.loadJsonFile(info.source);
        
        for(const [key, value] of Object.entries({...config, ...info})){
            this[key] = value;
        }
    }

    evalMethod(method: string){
        
        switch(method){
            case "load":
                return this.load(" A");
                break;
            case "get":
                return this.load(" B");
                    break;    
        }
    }

    load(str){

        let template = this.store.loadFile(this.templateFile);
        
        this.response = {
           
            element:"fragment",
            propertys : {
                innerHTML: template + str
            }
        };

        
        
        
        
    }
    
    getResponse():any{
        return this.response;
    }

    addResponse(response){
        //this.response.push(response);
    }
}
