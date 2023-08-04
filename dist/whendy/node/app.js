import { AppElement } from "./element.js";
import { loadFile } from "./tool.js";
export const externConfig = true;
export class App extends AppElement {
    constructor() {
        super(...arguments);
        this.element = "wh-app";
        this.response = [];
        this.elements = [];
        this.store = null;
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        //const config = loadJsonFile(info.source);
        if (info) {
            for (const [key, value] of Object.entries(info)) {
                this[key] = value;
            }
        }
    }
    evalMethod(method) {
        switch (method) {
            case "load":
                this.load();
                break;
        }
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        this.response.push(response);
    }
    load() {
        let template = loadFile(this.templateFile);
        const data = {
            mode: "update",
            element: "wh-app",
            id: this.id,
            props: {
                cssSheets: this.cssSheets,
                name: this.name,
                element: "wh-app",
                className: this.className,
                modules: this.modules,
                jsModules: this.jsModules,
                innerHTML: template,
            },
        };
        this.addResponse(data);
    }
    getElements() {
        return this.elements;
    }
}
//# sourceMappingURL=app.js.map