import { Element } from "./element.js";
export class Fragment extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = [];
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
                this.load();
                break;
        }
    }
    load() {
        let template = this.store.loadFile(this.templateFile);
        const data = {
            mode: "init",
            type: "element",
            wc: "wh-html",
            id: this.id,
            props: {
                innerHTML: template
            },
            //replayToken => $this->replayToken,
            appendTo: this.appendTo,
            setPanel: this.setPanel,
        };
        this.addResponse(data);
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
}
//# sourceMappingURL=fragment.js.map