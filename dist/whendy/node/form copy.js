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
export class Form extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = [];
        this.store = null;
        this._config = {};
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        const config = this.store.loadJsonFile(info.source) || {};
        this._config = config;
        for (const [key, value] of Object.entries(Object.assign(Object.assign({}, config), info))) {
            console.log(key, "=", value);
            this[key] = value;
        }
        //console.log("....FORM..", this._config)
    }
    evalMethod(method) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (method) {
                case "request":
                    yield this.load();
                    break;
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                mode: "init",
                type: "element",
                wc: "wh-form",
                id: this.id,
                props: {
                    dataSource: this._config
                },
                //replayToken => $this->replayToken,
                appendTo: this.appendTo,
                setPanel: this.setPanel,
            };
            //console.log(data)
            this.addResponse(data);
        });
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
}
//# sourceMappingURL=form%20copy.js.map