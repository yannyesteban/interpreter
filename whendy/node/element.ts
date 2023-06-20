import {Store} from "./store.js";

export class InfoElement {
  appendTo?:string;
  element?:string;
  source?:string;
  name?:string;
  method?:string;
  eparams?:object[];

  constructor(info){

    for(const [key, value] of Object.entries(info)){
        this[key] = value;
    }
  }
}


export abstract class Element{

    abstract setStore(store:Store):void;
    abstract init(store:InfoElement):void;
    abstract evalMethod(method: string):void;
    abstract getResponse():object[];

}


export abstract class AppElement extends Element{

    
}