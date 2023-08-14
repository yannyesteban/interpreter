import { AppElement } from "./element.js";
import { loadFile } from "./tool.js";
export const externConfig = true;
export class App extends AppElement {
    constructor() {
        super(...arguments);
        this.element = "wh-app";
        //response: object[] = [];
        this.elements = [];
        this.store = null;
        this.response = {};
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxx", info);
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
    load() {
        let template = loadFile(this.templateFile);
        this.response = {
            mode: "update",
            element: "app",
            propertys: {
                cssSheets: this.cssSheets,
                name: this.name,
                className: this.className,
                modules: this.modules,
                jsModules: this.jsModules,
                innerHTML: template,
            }
        };
        /*
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
        */
    }
    getElements() {
        return this.elements;
    }
    getResponse() {
        return this.response;
    }
    addResponse(response) {
        //this.response.push(response);
    }
}
//# sourceMappingURL=app.js.map