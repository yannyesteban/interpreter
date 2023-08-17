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
export class Model {
}
export class Form extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = {};
        this.store = null;
        this.connection = "mysql";
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
        //this._info = this.store.loadJsonFile(info.source) || {};
        //console.log("...", info);
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("eparams..", method, this.eparams);
            switch (method) {
                case "request":
                    yield this.load();
                    break;
                case "request2":
                    yield this.evalFields();
                    break;
                case "data-fields":
                    yield this.doDataFields((_a = this.eparams) === null || _a === void 0 ? void 0 : _a.parent);
                    break;
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (this.db = this.store.db.get(this.connection));
            let result = yield db.infoTable("cities");
            this.addResponse({
                logs: result,
            });
            let data = yield db.query(this.data);
            this._data = data.rows[0];
            this._data["state_id"] = 2040;
            this._data["city_id"] = 130165;
            this.layout.data = data.rows[0];
            if (this.datafields) {
                //this.layout.dataLists = await this.evalDataFields(this.datafields);
            }
            const output = [];
            if (this.dataLists) {
                //console.log(this.dataFetch)
                for (const d of this.dataLists) {
                    output.push({
                        name: d.name,
                        data: yield this.evalData(d.data),
                        childs: d.childs,
                        parent: d.parent,
                        mode: d.mode,
                        value: this._data[d.name],
                    });
                }
                //console.log(output)
                this.layout.dataLists = output;
            }
            //this.addResponse(data);
            this.layout.appRequests = {
                dataField: {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            id: this.id,
                            name: this.name,
                            method: "data-fields",
                        },
                    ],
                },
            };
            this.response = {
                element: "form",
                propertys: {
                    dataSource: this.layout,
                    //f: await this.evalDataFields(this.datafields),
                    output,
                },
            };
        });
    }
    getDataFields(list) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = [];
            for (const info of list) {
                output.push(yield this.getDataField(info));
            }
            return output;
        });
    }
    getDataField(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: info.name,
                data: yield this.evalData(info.data),
                childs: info.childs,
                parent: info.parent,
                mode: info.mode,
            };
        });
    }
    doDataFields(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            this._data = this.store.getVReq();
            console.log("doDataFields", parent);
            const db = (this.db = this.store.db.get(this.connection));
            const list = this.dataLists.filter((data) => data.parent == parent) || [];
            console.log(list);
            const output = yield this.getDataFields(list);
            console.log("output-->", output);
            this.response = {
                element: "form",
                propertys: {
                    dataFields: output,
                    //f: await this.evalDataFields(this.datafields),
                    output,
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
    evalDataFields(dataFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            for (const [field, dataField] of Object.entries(dataFields)) {
                result[field] = {
                    data: yield this.evalData(dataField),
                };
            }
            return result;
        });
    }
    evalData(dataField) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this._data);
            dataField = JSON.parse(this.store.evalSubData(JSON.stringify(dataField), this._data));
            let info = [];
            for (const data of dataField) {
                if (Array.isArray(data)) {
                    info.push({ value: data[0], text: data[1], level: (_a = data[2]) !== null && _a !== void 0 ? _a : undefined });
                }
                else if (typeof data === "object") {
                    if (data.sql) {
                        let result = (yield this.db.query(data.sql, (_b = data.params) !== null && _b !== void 0 ? _b : undefined)).rows;
                        info = [...info, ...result];
                    }
                    else if (data.value && data.text) {
                        info.push(data);
                    }
                }
            }
            return info;
        });
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