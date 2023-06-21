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
    
    response:object[] = [];

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
                this.load();
                break;
        }
    }

    load(){

        let template = this.store.loadFile(this.templateFile);
        
        const data = {
            
            mode: "init",
            type: "element",
            wc:"wh-html",
            id: this.id,
            props: {

                innerHTML: template
            },
            //replayToken => $this->replayToken,
            appendTo:this.appendTo,
            setPanel: this.setPanel,
        };
        
        this.addResponse(data);
    }
    
    getResponse():object[]{
        return this.response;
    }

    addResponse(response){
        this.response.push(response);
    }
}
