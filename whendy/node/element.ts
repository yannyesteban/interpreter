import { Store } from "./store.js";

export class UserInfo {
  auth: boolean;
  user: string;
  roles: string[];
}

export class OutputInfo {
  id?: string;
  mode?:string;
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
  id?: string;
  mode?:string;
  type?: string;
  appendTo?: string;
  setPanel?: string;
  element?: string;
  source?: string;
  name?: string;
  method?: string;
  eparams?: object[];

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
  abstract getResponse(): object[];


}


export abstract class AppElement extends Element implements IElementAdmin {
  abstract getElements(): InfoElement[];
}




