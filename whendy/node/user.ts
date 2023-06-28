import { InfoElement, Element, IUserAdmin, UserInfo } from "./element.js";
import { Store } from "./store.js";

export class User extends Element implements IUserAdmin{
    

    public id:string;
    public name: string;
    public element:string =   "";
    public className : string | string [];
    public setPanel:string;
    public appendTo: string;
    
    public user:string = "";
    public roles:string[] = [];
    
    
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
            case "login":
                const user = this.store.getReq("user");
                const pass = this.store.getReq("pass");
                this.dbLogin(user, pass);
                break;
        }
    }

    dbLogin(user:string, pass:string ){

        let security = "md5";
        let error = 0;
        let auth = false;
        
        if(error === 0){
            this.user = user;
            this.roles = this.dbRoles(user);
        }
        
        const data = {
            
            mode: "init",
            type: "element",
            wc:"wh-app",
            
            props: {

                store: {
                    message:"ok"
                }
            },
            //replayToken => $this->replayToken,
            appendTo:this.appendTo,
            setPanel: this.setPanel,
        };
        
        this.addResponse(data);
    }

    dbRoles(user: string):string[]{

		
        return [""];
    }
    
    getResponse():object[]{
        return this.response;
    }

    addResponse(response){
        this.response.push(response);
    }

    getUserInfo(): UserInfo {
        return {
            user: this.user,
            roles: this.roles
        }
    }
}
