import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";

export class Form extends Element{

    public id:string;
    public name: string;
    public element:string =   "wh-html";
    public className : string | string [];
    public setPanel:string;
    public appendTo: string;
    
    templateFile: string;
    
    response:object[] = [];

    store:Store = null;

    _config:any = {};

    setStore(store:Store){
        this.store = store;
    }
    
    init(info:InfoElement){

        

        const config = this.store.loadJsonFile(info.source) || {};
        this._config = config;

        
        
        for(const [key, value] of Object.entries({...config, ...info})){
            console.log(key, "=", value)
            this[key] = value;
        }

        //console.log("....FORM..", this._config)
        
    }

    evalMethod(method: string){
        
        switch(method){
            case "request":
                this.load();
                break;
        }
    }

    load(){

        //let template = this.store.loadFile(this.templateFile);
        
        const data = {
            
            mode: "init",
            type: "element",
            wc:"wh-form",
            id: this.id,
            props: {
                dataSource : this._config
            },
            //replayToken => $this->replayToken,
            appendTo:this.appendTo,
            setPanel: this.setPanel,
        };
        console.log(data)
        this.addResponse(data);
    }
    
    getResponse():object[]{
        return this.response;
    }

    addResponse(response){
        this.response.push(response);
    }
}
