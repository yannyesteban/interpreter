import {IMachine, ISession} from './manager';

class Session implements ISession{

    id = null;
    data = null;
    constructor(id){
        this.id;
        this.data = {}

    }

    set(key, value){
        this.data[key] = value;
    }

    get(key){
        return this.data[key];
    }

    getSessionId(){
        return this.id;
    }

    delete(key){

        delete this.data[key];
    }
}

export class Memory implements IMachine{

    sessions:{[key:string]: ISession}  = {};


    init(sessionId){
        if(this.sessions[sessionId] === undefined){
            this.sessions[sessionId] = new Session(sessionId);
        }
        
        return this.sessions[sessionId];

    }

    read(sessionId: string): ISession {
        return this.sessions[sessionId];
    }

}