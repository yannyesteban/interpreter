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
        this.connection = "mysql";
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        this._info = this.store.loadJsonFile(info.source) || {};
        for (const [key, value] of Object.entries(Object.assign(Object.assign({}, this._info), info))) {
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
                case "request2":
                    yield this.evalFields();
                    break;
            }
        });
    }
    form() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (this.db = this.store.db.get(this.connection));
            console.log(this.query);
            let result = yield db.infoTable("person");
            console.log(result);
            this.addResponse({
                logs: result,
            });
            let result1 = yield db.query("select a,b,c, d as x, 123 as num, id as f from person");
            this.addResponse({
                logs: result1,
            });
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
                    dataSource: this._info,
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
    evalFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const mainElements = [];
            const fields = this.fields;
            let tab = null;
            let section = {};
            if ("sections" in this._info) {
                section = this._info.sections.reduce((a, s) => {
                    a[s.from] = {
                        element: "section",
                        title: s.title,
                        elements: [],
                    };
                    return a;
                }, {});
            }
            if ("tabs" in this._info) {
                tab = this._info.tabs.reduce((tab, s) => {
                    tab[s.from] = {
                        element: "tab",
                        to: s.to,
                        title: s.title,
                        page: s.pages.reduce((page, p) => {
                            page[p.field] = {
                                element: "section",
                                title: p.title,
                                elements: [],
                            };
                            return page;
                        }, {}),
                    };
                    return tab;
                }, {});
            }
            let elements = mainElements;
            let infoTab = null;
            let lastTab = null;
            for (const field of fields) {
                if (field.name in tab) {
                    console.log("STEP ONE", field.name);
                    lastTab = {
                        element: "tab",
                        title: tab[field.name].title,
                        pages: [],
                    };
                    mainElements.push(lastTab);
                    infoTab = tab[field.name];
                }
                if (infoTab) {
                    if (field.name in infoTab.page) {
                        elements = [];
                        lastTab.pages.push(elements);
                    }
                }
                if (field.name in section) {
                    mainElements.push(section[field.name]);
                    elements = section[field.name].elements;
                }
                elements.push(field);
            }
            this.addResponse({
                logs: section,
                con: mainElements,
            });
        });
    }
}
//# sourceMappingURL=form.js.map