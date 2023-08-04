import { InfoElement, Element, IElementAdmin, AppElement } from "./element.js";
import { Store } from "./store.js";
import { loadFile, loadJsonFile } from "./tool.js";

export const externConfig = true;

export class App extends AppElement {
    id: string;
    name: string;
    element: string = "wh-app";
    className: string | string[];
    modules: object[];
    jsModules: object[];
    templateFile: string;
    cssSheets: string[];
    response: object[] = [];
    elements: InfoElement[] = [];
    store: Store = null;
    

    eparams:any;
    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {
        
        //const config = loadJsonFile(info.source);

        if (info) {
            for (const [key, value] of Object.entries(info)) {
                this[key] = value;
            }
        }
        
    }
    
    evalMethod(method: string) {
        switch (method) {
            case "load":
                this.load();
                break;
        }
    }

    getResponse(): object[] {
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

    getElements(): InfoElement[] {
        return this.elements;
    }
}
