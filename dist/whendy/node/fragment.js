import { Element } from "./element.js";
export class Fragment extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = {};
        this.store = null;
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        const config = this.store.loadJsonFile(info.source);
        for (const [key, value] of Object.entries(Object.assign(Object.assign({}, config), info))) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        switch (method) {
            case "load":
                return this.load(" A");
                break;
            case "get":
                return this.load(" B");
                break;
        }
    }
    load(str) {
        let template = this.store.loadFile(this.templateFile);
        console.log(template);
        this.response = {
            element: "div",
            propertys: {
                innerHTML: template + str
            }
        };
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        //this.response.push(response);
    }
}
//# sourceMappingURL=fragment.js.map