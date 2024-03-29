var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DBTransaction as Transaction } from "./db/DBTransaction.js";
import { Element } from "./element.js";
import { JWT } from "./JWT.js";
var ModeForm;
(function (ModeForm) {
    ModeForm[ModeForm["INSERT"] = 1] = "INSERT";
    ModeForm[ModeForm["UPDATE"] = 2] = "UPDATE";
    ModeForm[ModeForm["DELETE"] = 3] = "DELETE";
    ModeForm[ModeForm["AUTO"] = 4] = "AUTO";
})(ModeForm || (ModeForm = {}));
export class Model {
}
export class Form extends Element {
    constructor() {
        super(...arguments);
        this.element = "wh-html";
        this.response = {};
        this.store = null;
        this.connection = "mysql";
        this.params = {};
        this.keySecret = "Robin Williams";
    }
    setStore(store) {
        this.store = store;
    }
    init(info /*: InfoElement*/) {
        this._config = info;
        this._info = info;
        //this._info = this.store.loadJsonFile(info.source) || {};
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
    evalMethod(method) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.method = method;
            if (this._info.methods && this._info.methods[method]) {
                this._info = Object.assign(Object.assign({}, this._info), (_a = this._info) === null || _a === void 0 ? void 0 : _a.methods[method]);
            }
            this.state = {
                page: this.params["page"] || this.store.getSes("__page_") || "1",
                filter: this.params["filter"] || this.store.getReq("__filter_"),
                key: this.store.getReq("__key_") || this.store.getSes("__key_"),
                record: this.params.__record_ ||
                    this.store.getReq("__record_") ||
                    this.store.getSes("__record_"),
            };
            switch (method) {
                case "load-form":
                    this.state.key = null;
                    yield this.loadForm(ModeForm.INSERT);
                    break;
                case "list":
                    const page = this.store.getSes("__page_") || "1";
                    yield this.doGrid(Number(page));
                    break;
                case "new-record":
                    this.state.key = null;
                    yield this.loadForm(ModeForm.INSERT);
                    break;
                case "request":
                    yield this.loadForm(ModeForm.INSERT);
                    break;
                case "load-record":
                    yield this.loadForm(ModeForm.UPDATE);
                    break;
                case "request2":
                    yield this.evalFields();
                    break;
                case "find":
                    yield this.find();
                    break;
                case "data-fields":
                    yield this.doDataFields((_b = this.params) === null || _b === void 0 ? void 0 : _b.parent);
                    break;
                case "save":
                    yield this.saveRecord();
                    break;
                case "load-page":
                    yield this.loadPageInfo();
            }
        });
    }
    doFormElements() {
        const config = this._config;
        if (config.form.layout) {
            return config.form.layout;
        }
        let section = {};
        if ("sections" in config.form) {
            section = config.form.sections.reduce((a, s) => {
                a[s.name] = {
                    component: "section",
                    label: s.label,
                    className: s.className,
                    elements: [],
                };
                return a;
            }, {});
        }
        let pages = {};
        let tabPages = {};
        if ("tabs" in config.form) {
            for (const tab of config.form.tabs) {
                tabPages[tab.name] = {
                    component: "tab",
                    label: tab.label,
                    className: tab.className,
                    elements: tab.elements.map((e) => {
                        const _page = {
                            component: "tabPage",
                            label: e.label,
                            className: e.className,
                            elements: [],
                        };
                        pages[e.name] = {
                            page: _page,
                            parent: tabPages[tab.name],
                        };
                        return _page;
                    }),
                };
            }
        }
        let elements = [];
        let page = elements;
        for (const field of config.fields) {
            const f = {
                id: field.id,
                component: "field",
                name: field.name,
                label: field.name,
                className: field.className,
                input: field.input,
                type: field.type,
                required: field.required,
                rules: field.rules,
                events: field.events,
                propertys: field.propertys,
                attributes: field.attributes,
            };
            if (field.name in tabPages) {
                elements.push(tabPages[field.name]);
            }
            if (field.name in pages) {
                page = pages[field.name].page.elements;
            }
            if (field.name in section) {
                elements.push(section[field.name]);
                page = section[field.name].elements;
            }
            page.push(f);
        }
        this.configInputs().forEach((item) => elements.push(item));
        if (config.nav[config.form.nav]) {
            elements.push(config.nav[config.form.nav]);
        }
        return elements;
    }
    getRecordData(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this._config;
            const connection = this._config.connection || this.connection;
            let data = config.defaultData || {};
            data.__page_ = this.state.page;
            data.__filter_ = this.state.filter;
            const key = this.getRecordKey();
            if (key) {
                const db = this.store.db.get(connection);
                data = Object.assign(Object.assign({}, data), (yield db.getRecord(config.form.recordData, key)));
            }
            data = Object.assign(Object.assign(Object.assign({}, data), { __mode_: mode }), (this._info.fixedData || {}));
            if (+mode != ModeForm.INSERT) {
                data.__key_ = this.genToken(key);
            }
            return data;
        });
    }
    loadForm(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this._config;
            const form = this._config.form;
            const values = yield this.getRecordData(mode);
            const dataSource = {
                caption: form.label || config.label,
                className: form.className || config.className,
                elements: this.doFormElements(),
                nav: config.nav[form.nav],
                dataLists: yield this.getDataList(config.dataLists, values),
                values,
                appRequests: yield this.appRequests("list"),
            };
            this.doResponse({
                element: "form",
                propertys: {
                    dataSource,
                    log: {},
                },
            });
        });
    }
    doGrid(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this._info.fields.map((field) => ({
                name: field.name,
                label: field.label,
                type: field.cellType,
                cellWidth: field.cellWidth,
            }));
            const { label, gridData, gridOptions, errorMessages, nav } = this._info;
            if (this.params.page === null) {
                gridData.page =
                    this.store.getReq("__page_") || this.store.getSes("__page_");
            }
            const info = yield this._pageData(gridData);
            const appRequests = this.appRequests();
            this.doResponse({
                element: "grid",
                propertys: {
                    dataSource: {
                        caption: label,
                        fields,
                        data: info.data,
                        limit: +gridData.limit,
                        page: +info.page,
                        records: +info.totalRecords,
                        maxPages: +(info.totalPages || gridOptions.maxPages || 6),
                        filter: gridData.filter,
                        nav,
                        errorMessages,
                        appRequests,
                    },
                    output: info.data,
                },
                log: "yanny esteban",
            });
        });
    }
    loadPageInfo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { gridData, fields } = this._info;
            if ((_a = this.params) === null || _a === void 0 ? void 0 : _a.filter) {
                gridData.filter = this.params.filter;
            }
            const pageData = yield this._pageData(gridData);
            this.doResponse({
                element: "grid",
                propertys: {
                    pageData: Object.assign(Object.assign({}, pageData), { fields }),
                },
            });
        });
    }
    doKeyRecord(record1, data) {
        const record = ["employeeNumber"];
        const key = record.reduce((acc, e) => ((acc[e] = data[e]), acc), {});
        return key;
    }
    _pageData(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            const db = this.store.db.get(this.connection);
            let result = yield db.query(info);
            if (result.rows) {
                data = result.rows.map((row, index) => (Object.assign(Object.assign({}, row), { __mode_: 2, __key_: this.genToken(this.doKeyRecord({}, row)) })));
            }
            return {
                data,
                totalRecords: result.totalRecords || 0,
                totalPages: result.totalPages || 0,
                page: result.page || 1,
                limit: info.limit,
                filter: info.filter,
            };
        });
    }
    addRequest(type, info) { }
    getDataRecord(info) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //info = JSON.parse(this.store.evalSubData(JSON.stringify(info), this._data));
            if (info.sql) {
                const rows = (yield this.db.query(info.sql, (_a = info.params) !== null && _a !== void 0 ? _a : undefined))
                    .rows;
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
            data["__key_"] = token;
            data["__mode_"] = 2;
            //this._data["__key_"] = JSON.stringify(this.record);
            this.layout.data = data;
            if (this.datafields) {
                //this.layout.dataLists = await this.evalDataFields(this.datafields);
            }
            const output = [];
            if (this.dataLists) {
                for (const d of this.dataLists) {
                    output.push({
                        name: d.name,
                        data: yield this.evalData(d.data, this._data),
                        childs: d.childs,
                        parent: d.parent,
                        mode: d.mode,
                        value: data[d.name],
                    });
                }
                this.layout.dataLists = output;
            }
            this.layout.appRequests = this.appRequests("list");
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
            this.doResponse({
                element: "form",
                propertys: {
                    dataSource: this.layout,
                    //f: await this.evalDataFields(this.datafields),
                    output,
                },
            });
        });
    }
    saveRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.store.db.get(this.connection);
            const key = this.getRecordKey();
            //const mode = +this.store.getReq("__mode_");
            const data = Object.assign(Object.assign({}, this.store.getVReq()), { __key_: key });
            const scheme = this._info.scheme;
            const config = {
                transaction: true,
            };
            const transaction = new Transaction(config, db);
            const result = yield transaction.save(scheme, [data], {});
            let message = "";
            let keyToken = "";
            if (result.error) {
                message = result.error;
                this.store.setSes("__error_", true);
            }
            else {
                this.store.setSes("__error_", false);
                message = "record was saved correctly!";
                if (result.recordId) {
                    keyToken = this.genToken(result.recordId);
                }
            }
            this.store.setSes("__key_", keyToken);
            this.doResponse({
                /*
                            element: "form",
                            propertys: {
                                //f: await this.evalDataFields(this.datafields),
                                output: "SAVE FORM",
                            },
                            */
                log: Object.assign({}, result),
                message,
            });
        });
    }
    /*
      private async getDataFields(list) {
        const output = [];
        for (const info of list) {
          output.push(await this.getDataField(info));
        }
        return output;
      }
    
      private async getDataField(info) {
        return {
          name: info.name,
          data: await this.evalData(info.data, this._data),
          childs: info.childs,
          parent: info.parent,
          mode: info.mode,
        };
      }
    */
    getDataList(dataLists, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = [];
            if (dataLists) {
                for (const list of dataLists) {
                    dataList.push({
                        name: list.name,
                        data: yield this.evalData(list.data, values),
                        childs: list.childs,
                        parent: list.parent,
                        mode: list.mode,
                        value: values[list.name],
                    });
                }
            }
            return dataList;
        });
    }
    doDataFields(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = this.store.getVReq();
            //const db = (this.db = this.store.db.get<DBEngine>(connection));
            const list = this.dataLists.filter((data) => data.parent == parent);
            this.doResponse({
                element: "form",
                propertys: {
                    dataFields: yield this.getDataList(list, values)
                },
            });
        });
    }
    evalData(dataField, values) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            dataField = JSON.parse(this.store.evalSubData(JSON.stringify(dataField), values));
            let info = [];
            const db = this.store.db.get(this.connection);
            for (const data of dataField) {
                if (Array.isArray(data)) {
                    info.push({
                        value: data[0],
                        text: data[1],
                        level: (_a = data[2]) !== null && _a !== void 0 ? _a : undefined,
                    });
                }
                else if (typeof data === "object") {
                    if (data.sql) {
                        const result = (yield db.query(data.sql, (_b = data.params) !== null && _b !== void 0 ? _b : undefined))
                            .rows;
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
        });
    }
    genToken(payload) {
        if (!payload) {
            return "";
        }
        const jwt = new JWT({ key: this.keySecret });
        return jwt.generate(payload);
    }
    decodeToken(token) {
        const jwt = new JWT({ key: this.keySecret });
        return jwt.verify(token);
    }
    getRecordKey() {
        if (this.state.key) {
            return this.decodeToken(this.state.key);
        }
        return this.state.record;
    }
    appRequests(type) {
        const requests = {
            dataField: {
                blockTo: true,
                actions: [
                    {
                        do: "update",
                        to: "{{&TO_}}",
                        api: "form",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "data-fields",
                        params: {
                            parent: "{=parent}",
                        },
                    },
                ],
            },
            save: {
                blockTo: true,
                confirm: "secure save?",
                reportValidity: true,
                valid: true,
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "save",
                    },
                    {
                        do: "set-panel",
                        to: "{{&TO_}}",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        api: "form",
                        method: "load-record",
                        params: {
                            page: 2,
                        },
                        doWhen: {
                            __error_: false,
                        },
                    },
                ],
            },
            delete: {
                blockTo: true,
                setFormValue: {
                    __mode_: "3",
                },
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: null,
                        name: "{{&NAME_}}",
                        method: "save",
                    },
                    {
                        do: "set-panel",
                        to: "{{&TO_}}",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        api: "form",
                        method: "load-record",
                        params: {
                            page: 2,
                        },
                        doWhen: {
                            __error_: false,
                        },
                    },
                ],
            },
            list: {
                blockTo: true,
                actions: [
                    {
                        do: "set-panel",
                        api: "form",
                        to: "{{&TO_}}",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "list",
                        params: {
                            page: 1,
                        },
                    },
                ],
            },
            "load-page": {
                blockTo: true,
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "load-page",
                        params: {
                            page: "{=page}",
                            filter: "{=filter}",
                        },
                    },
                ],
            },
            "edit-record": {
                validate: "#{{&ID_}}",
                validateOption: "select",
                blockTo: true,
                actions: [
                    {
                        do: "set-panel",
                        api: "form",
                        to: "{{&TO_}}",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "load-record",
                    },
                ],
            },
            "delete-record": {
                blockTo: true,
                confirm: "borrando!",
                validate: "#{{&ID_}}",
                validateOption: "select",
                setFormValue: {
                    __mode_: "3",
                },
                store: {
                    __page_: "1",
                },
                actions: [
                    {
                        do: "update",
                        api: "form",
                        to: null,
                        id: null,
                        name: "{{&NAME_}}",
                        method: "save",
                    },
                    {
                        do: "set-panel",
                        api: "form",
                        to: "{{&TO_}}",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "list",
                        params: {
                            page: null,
                        },
                    },
                ],
            },
            filter: {
                blockTo: true,
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "load-page",
                        params: {
                            page: 1,
                            filter: "{=filter}",
                        },
                    },
                ],
            },
            new: {
                blockTo: true,
                actions: [
                    {
                        do: "set-panel",
                        to: "{{&TO_}}",
                        api: "form",
                        id: "{{&ID_}}",
                        name: "{{&NAME_}}",
                        method: "new-record",
                    },
                ],
            },
        };
        return JSON.parse(this.store.eval(JSON.stringify(requests)));
    }
    configInputs() {
        return [
            {
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            },
            {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            },
            {
                component: "field",
                label: "__filter_",
                input: "input",
                name: "__filter_",
            },
            {
                component: "field",
                label: "__page_",
                input: "input",
                name: "__page_",
            },
        ];
    }
    test() {
        const DBRequest = {
            sql: "select",
            filter: [],
            params: [],
            select: [["add", "field1", ["mult", 3, 4]]],
            from: "t:t1",
            join: ["inner", "t2:t2", { "t1.a": "t2.a" }],
            where: { "a:>": 2 },
            orderBY: ["desc", "field1"],
            limit: 4,
            offset: 10,
        };
    }
}
//# sourceMappingURL=form.js.map