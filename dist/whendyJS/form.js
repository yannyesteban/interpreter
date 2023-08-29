var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DBTransaction } from "./db/DBTransaction.js";
import { Element } from "./element.js";
import { JWT } from "./JWT.js";
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
        this._info = info;
        //this._info = this.store.loadJsonFile(info.source) || {};
        //console.log("...", info);
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("eparams..", method, this.eparams);
            switch (method) {
                case "request":
                    yield this.load();
                    break;
                case "load-record":
                    yield this.loadRecord();
                    break;
                case "request2":
                    yield this.evalFields();
                    break;
                case "find":
                    yield this.find();
                    break;
                case "data-fields":
                    yield this.doDataFields((_a = this.eparams) === null || _a === void 0 ? void 0 : _a.parent);
                    break;
                case "save":
                    yield this.transaction();
                    break;
                case "list":
                    const page = this.store.getSes("__page_") || "1";
                    yield this.list(Number(page));
                    break;
                case "load-page":
                    yield this.loadPageInfo();
            }
        });
    }
    list(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this._info.fields.map((field) => ({
                name: field.name,
                label: field.label,
                type: field.cellType,
                cellWidth: field.cellWidth,
            }));
            const list = this._info.listData;
            let info;
            let totalRecords = null;
            if (list) {
                info = yield this._pageData(list);
            }
            const appRequests = {
                "load-page": {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            id: this.id,
                            name: this.name,
                            method: "load-page",
                        },
                    ],
                },
                "edit-record": {
                    //form: this,
                    actions: [
                        {
                            type: "set",
                            element: "form",
                            "setPanel": "p2",
                            id: this.id,
                            name: this.name,
                            method: "load-record",
                        },
                    ],
                },
                "filter": {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            "setPanel": "p2",
                            id: this.id,
                            name: this.name,
                            method: "load-page",
                        },
                    ],
                }
            };
            const dataSource = {
                caption: "hello Mundo",
                data: info.data,
                fields,
                limit: +list.limit,
                page: +list.page,
                records: +info.totalRecords,
                maxPages: +list.maxPages || 6,
                filter: list.filter,
                nav: {
                    elements: [
                        {
                            type: "button",
                            label: "save",
                            className: "",
                            action: "save",
                            "request": {},
                            click: ""
                        },
                        {
                            type: "button",
                            label: "Delete",
                            className: "",
                            action: "delete",
                            "request": {},
                            click: ""
                        },
                        {
                            type: "button",
                            label: "Todos",
                            className: "",
                            action: "list",
                            "request": {},
                            click: ""
                        }
                    ]
                },
                appRequests
            };
            this.response = {
                element: "grid",
                propertys: {
                    dataSource,
                    //f: await this.evalDataFields(this.datafields),
                    output: info.data,
                },
            };
        });
    }
    loadPageInfo() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const list = this._info.listData;
            if ((_a = this.eparams) === null || _a === void 0 ? void 0 : _a.filter) {
                list.filter = (_b = this.eparams) === null || _b === void 0 ? void 0 : _b.filter;
            }
            let pageData = yield this._pageData(list);
            //console.log("--------------------", this._pageData(list))
            this.response = {
                element: "grid",
                propertys: {
                    pageData: Object.assign(Object.assign({}, pageData), { fields: this._info.fields }),
                    //f: await this.evalDataFields(this.datafields),
                },
            };
        });
    }
    doKeyRecord(record1, data) {
        const record = ["employeeNumber"];
        const key = record.reduce((acc, e) => (acc[e] = data[e], acc), {});
        //console.log(data, "................",key)
        return key;
    }
    _pageData(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            let totalRecords = 0;
            if (info.sql) {
                const db = (this.db = this.store.db.get(this.connection));
                let filters = [];
                let values = [];
                if (this.eparams.filter) {
                    if (info.searchIn) {
                        info.searchIn.forEach(e => {
                            filters.push(`${e} like concat('%',?,'%')`);
                            values.push(info.filter);
                        });
                    }
                    info.sql += " WHERE " + filters.join(" OR ");
                    console.log(this.eparams, info.sql, filters, values);
                }
                let result = yield db.query(info, values);
                const record = ["id"];
                console.log(result);
                if (result.rows) {
                    data = result.rows.map((row, index) => (Object.assign(Object.assign({}, row), { __mode_: 2, __key_: this.genToken(this.doKeyRecord({}, row)) })));
                }
                //console.log(data)
                console.log(db.doQueryAll(info.sql));
                result = yield db.query(db.doQueryAll(info.sql), values);
                if (result.rows.length > 0) {
                    totalRecords = result.rows[0].total;
                }
            }
            return {
                data, totalRecords, page: info.page, limit: info.limit, filter: info.filter
            };
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
            this._data["__mode_"] = this.mode;
            this._data["__key_"] = JSON.stringify(this.record);
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
                save: {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            id: this.id,
                            name: this.name,
                            method: "save",
                        },
                    ],
                },
            };
            this.layout.elements.push({
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            }, {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            });
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
    loadRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(this._info.recordData)
            let query = this._info.recordData.sql;
            const key = this.decodeToken(this.store.getSes("__key_"));
            let conditions = [];
            let values = [];
            const record = this._info.recordData.record.forEach(field => {
                conditions.push(field + "= ?");
                values.push(key[field]);
            });
            query += " WHERE " + conditions.join(" AND ");
            const db = (this.db = this.store.db.get(this.connection));
            //console.log("__key_......",this.decodeToken(this.store.getSes("__key_")))
            let data = yield db.query(query, values);
            this._data = data.rows[0];
            this._data["state_id"] = 2040;
            this._data["city_id"] = 130165;
            this._data["__mode_"] = this.mode;
            this._data["__key_"] = this.store.getSes("__key_"); //JSON.stringify(this.record);
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
                save: {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            id: this.id,
                            name: this.name,
                            method: "save",
                        },
                    ],
                },
            };
            this.layout.elements.push({
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            }, {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            });
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
    getDataRecord(info) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //info = JSON.parse(this.store.evalSubData(JSON.stringify(info), this._data));
            if (info.sql) {
                const rows = (yield this.db.query(info.sql, (_a = info.params) !== null && _a !== void 0 ? _a : undefined)).rows;
                if (rows.length > 0) {
                    return rows[0];
                }
            }
            return {};
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (this.db = this.store.db.get(this.connection));
            let data = yield this.getDataRecord(this.dataRecord);
            this._data = data;
            let key;
            if (this.recordKey) {
                key = {
                    record: this.recordKey.reduce((a, fieldName) => ((a[fieldName] = data[fieldName]), a), {}),
                };
            }
            const jwt = new JWT({ key: "yanny" });
            const token = jwt.generate(key);
            //console.log(key, token);
            //employeeNumber
            data["__key_"] = token;
            data["__mode_"] = 2;
            //this._data["__key_"] = JSON.stringify(this.record);
            this.layout.data = data;
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
                        value: data[d.name],
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
                save: {
                    //form: this,
                    actions: [
                        {
                            type: "element",
                            element: "form",
                            id: this.id,
                            name: this.name,
                            method: "save",
                        },
                    ],
                },
            };
            this.layout.elements.push({
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            }, {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            }, {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            });
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
    transaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.store.getReq("__key_");
            const jwt = new JWT({ key: "yanny" });
            const key = jwt.verify(token);
            //console.log("-----KEY ", key)
            const json = {
                db: "mysql",
                transaction: true,
                schemes: [Object.assign(Object.assign({}, this.scheme), { name: this.name })],
                dataset: [
                    {
                        scheme: this.name,
                        mode: +this.store.getReq("__mode_"),
                        record: key,
                        data: this.store.getVReq(),
                    },
                ],
                masterData: {},
            };
            const c = new DBTransaction(json, this.store.db);
            this.response = {
                element: "form",
                propertys: {
                    //f: await this.evalDataFields(this.datafields),
                    output: "SAVE FORM",
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
            const db = (this.db = this.store.db.get(this.connection));
            const list = this.dataLists.filter((data) => data.parent == parent) || [];
            const output = yield this.getDataFields(list);
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
    genToken(payload) {
        const jwt = new JWT({ key: "yanny" });
        return jwt.generate(payload);
    }
    decodeToken(token) {
        const jwt = new JWT({ key: "yanny" });
        return jwt.verify(token);
    }
}
//# sourceMappingURL=form.js.map