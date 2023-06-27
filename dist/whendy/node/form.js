import { Element } from "./element.js";
export class Form extends Element {
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
        const config = this.store.loadJsonFile(info.source) || {};
        for (const [key, value] of Object.entries(Object.assign(Object.assign({}, config), info))) {
            this[key] = value;
        }
        this.config = config;
        //console.log("FORM..", this.config)
    }
    evalMethod(method) {
        switch (method) {
            case "request":
                this.load();
                break;
        }
    }
    load() {
        //let template = this.store.loadFile(this.templateFile);
        const data = {
            mode: "init",
            type: "element",
            wc: "wh-form",
            id: this.id,
            props: { dataSource: this.config
            },
            //replayToken => $this->replayToken,
            appendTo: this.appendTo,
            setPanel: this.setPanel,
        };
        console.log(data);
        this.addResponse(data);
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
}
//# sourceMappingURL=form.js.map