import { Store } from "./store.js";

export class UserInfo {
  auth: boolean;
  user: string;
  roles: string[];
}

export class OutputInfo {
  info?:any;
  dinamic?:boolean;
  type?:string;
  data?:any;
  id?: string;
  name?:string;
  mode?:string;
  method?:string;
  appendTo?: string;
  setPanel?: string;
  element?: string;
  props?:object;  
  

  constructor(info) {

    for (const [key, value] of Object.entries(info)) {
      this[key] = value;
    }
  }
}

export class InfoElement {
  do?:string;
  panel?:string;
  id?: string;
  //mode?:string;
  //type?: string;
  appendTo?: string;
  //setPanel?: string;
  api?: string;
  //source?: string;
  name?: string;
  method?: string;
  params?: object[];

  constructor(info) {

    for (const [key, value] of Object.entries(info)) {
      this[key] = value;
    }
  }
}

export interface IElementAdmin {
  getElements(): InfoElement[];
}

export interface IRestElement {
  getRestData(): any;
}

export interface IUserAdmin {
  getUserInfo(): UserInfo;
}

export abstract class Element {

  abstract setStore(store: Store): void;
  abstract init(store: InfoElement): void;
  abstract evalMethod(method: string): void;
  abstract getResponse(): any;


}


export abstract class AppElement extends Element implements IElementAdmin {
  abstract getElements(): InfoElement[];
}




