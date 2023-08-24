var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Element } from "./element.js";
export class Menu extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = {};
        this.store = null;
        this._config = {};
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        this._config = info;
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (method) {
                case "load":
                    yield this.load();
                    break;
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {
                element: "menu",
                propertys: {
                    dataSource: this._config,
                },
            };
        });
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        //this.response.push(response);
    }
}
//# sourceMappingURL=menu.js.map