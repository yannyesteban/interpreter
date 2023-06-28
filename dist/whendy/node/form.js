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
            props: {
                dataSource: this._config
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