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
        this.params = {};
        this.keySecret = "Robin Williams";
    }
    setStore(store) {
        this.store = store;
    }
    init(info) {
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
            switch (method) {
                case "list":
                    const page = this.store.getSes("__page_") || "1";
                    yield this.doGrid(Number(page));
                    break;
                case "new-record":
                    yield this.doForm(1);
                    break;
                case "request":
                    yield this.doForm(1);
                    break;
                case "load-record":
                    yield this.doForm(2);
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
    doGrid(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this._info.fields.map((field) => ({
                name: field.name,
                label: field.label,
                type: field.cellType,
                cellWidth: field.cellWidth,
            }));
            const list = this._info.listData;
            if (this.params.page === null) {
                list.page = this.store.getReq("__page_") || this.store.getSes("__page_");
            }
            let info;
            if (list) {
                info = yield this._pageData(list);
            }
            const appRequests = this.appRequests();
            const dataSource = {
                caption: this._info.label,
                data: info.data,
                fields,
                limit: +list.limit,
                page: +list.page,
                records: +info.totalRecords,
                maxPages: +list.maxPages || 6,
                filter: list.filter,
                nav: this._info.nav,
                errorMessages: this._info.errorMessages,
                appRequests,
            };
            this.doResponse({
                element: "grid",
                propertys: {
                    dataSource,
                    //f: await this.evalDataFields(this.datafields),
                    output: info.data,
                },
                log: "yanny esteban",
            });
        });
    }
    loadPageInfo() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const list = this._info.listData;
            if ((_a = this.params) === null || _a === void 0 ? void 0 : _a.filter) {
                list.filter = (_b = this.params) === null || _b === void 0 ? void 0 : _b.filter;
            }
            let pageData = yield this._pageData(list);
            this.doResponse({
                element: "grid",
                propertys: {
                    pageData: Object.assign(Object.assign({}, pageData), { fields: this._info.fields }),
                    //f: await this.evalDataFields(this.datafields),
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            let totalRecords = 0;
            if (info.sql) {
                const db = (this.db = this.store.db.get(this.connection));
                let filters = [];
                let values = [];
                if ((_a = this.params) === null || _a === void 0 ? void 0 : _a.filter) {
                    if (info.searchIn) {
                        info.searchIn.forEach((e) => {
                            filters.push(`${e} like concat('%',?,'%')`);
                            values.push(info.filter);
                        });
                        info.sql += " WHERE " + filters.join(" OR ");
                    }
                }
                let result = yield db.query(db.doQueryAll(info.sql), values);
                if (result.rows.length > 0) {
                    totalRecords = result.rows[0].total;
                    const totalPages = Math.ceil(totalRecords / info.limit);
                    if (info.page > totalPages) {
                        info.page = totalPages;
                    }
                }
                result = yield db.query(info, values);
                const record = ["id"];
                if (result.rows) {
                    data = result.rows.map((row, index) => (Object.assign(Object.assign({}, row), { __mode_: 2, __key_: this.genToken(this.doKeyRecord({}, row)) })));
                }
            }
            return {
                data,
                totalRecords,
                page: info.page,
                limit: info.limit,
                filter: info.filter,
            };
        });
    }
    doForm(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = this.params["page"] || this.store.getReq("__page_") || 1;
            const filter = this.params["filter"] || this.store.getReq("__filter_");
            this.db = this.store.db.get(this.connection);
            let data = this._info.defaultData || {};
            data.__page_ = page;
            data.__filter_ = filter;
            const key = this.getRecordKey();
            if (key) {
                data = Object.assign(Object.assign({}, data), (yield this.getDBRecord(this._info.data, key)));
            }
            data = Object.assign(Object.assign(Object.assign({}, data), { __mode_: mode }), (this._info.fixedData || {}));
            if (+mode != 1) {
                data.__key_ = this.genToken(key);
            }
            this._data = data;
            if (this._info.nav) {
                this.layout.elements.push(this._info.nav);
            }
            this.layout.dataLists = yield this.getDataList();
            this.layout.appRequests = this.appRequests("list");
            this.layout.data = data;
            this.configInputs().forEach((item) => this.layout.elements.push(item));
            this.doResponse({
                element: "form",
                propertys: {
                    dataSource: this.layout,
                },
            });
        });
    }
    addRequest(type, info) { }
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
                        data: yield this.evalData(d.data),
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
            const key = this.getRecordKey();
            const scheme = this._info.schemes[0];
            const schemeName = "any";
            const config = {
                db: "mysql",
                transaction: true,
                schemes: [Object.assign(Object.assign({}, scheme), { name: schemeName })],
            };
            const dataset = [
                {
                    scheme: schemeName,
                    mode: +this.store.getReq("__mode_"),
                    record: key,
                    data: this.store.getVReq(),
                },
            ];
            const transaction = new DBTransaction(config, this.store.db);
            const result = yield transaction.save(dataset, {});
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
            this.doResponse({
                element: "form",
                propertys: {
                    dataFields: output,
                    //f: await this.evalDataFields(this.datafields),
                    output,
                },
            });
        });
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
        let key;
        const keyToken = this.params.__key_ || this.store.getReq("__key_") || this.store.getSes("__key_");
        if (keyToken) {
            key = this.decodeToken(keyToken);
        }
        else {
            key = this.params.__record_ || this.store.getReq("__record_") || this.store.getSes("__record_");
        }
        return key;
    }
    getDBRecord(info, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = info.sql;
            let conditions = [];
            let values = [];
            const record = this._info.data.record.forEach((field) => {
                conditions.push(field + "= ?");
                values.push(key[field]);
            });
            query += " WHERE " + conditions.join(" AND ");
            const data = yield this.db.query(query, values);
            return data.rows[0] || {};
        });
    }
    getDataList() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataList = [];
            if (this.dataLists) {
                for (const d of this.dataLists) {
                    dataList.push({
                        name: d.name,
                        data: yield this.evalData(d.data),
                        childs: d.childs,
                        parent: d.parent,
                        mode: d.mode,
                        value: this._data[d.name],
                    });
                }
            }
            return dataList;
        });
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
                    },
                ],
            },
            save: {
                blockTo: true,
                confirm: "secure save?",
                reportValidity: true,
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
}
//# sourceMappingURL=form.js.map