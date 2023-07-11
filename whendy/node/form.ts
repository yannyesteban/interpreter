import { DBSql } from "./db/db.js";
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

    private query: string;
    private db: DBSql;

    private connection: string = "mysql";
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

    async evalMethod(method: string){
        
        switch(method){
            case "request":
                await this.load();
                break;
            case "request2":
                await this.form();
                break;
        }
    }

    async form(){

        const db = this.db = this.store.db.get<DBSql>(this.connection);
        console.log(this.query);
        let result = await db.infoTable("person");
        console.log(result);
        this.addResponse({
            logs: result
        });

        let result1 = await db.query("select a,b,c, d as x, 123 as num, id as f from person");
        this.addResponse({
            logs: result1
        });
    }
    async load(){

        
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
        //console.log(data)
        this.addResponse(data);
    }
    
    getResponse():object[]{
        return this.response;
    }

    addResponse(response){
        this.response.push(response);
    }
}
