import { Store } from "./store.js";

export class UserInfo {
  user: string;
  roles: string[];
}

export class InfoElement {
  id?: string;
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
  getEndData(): InfoElement[];
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




