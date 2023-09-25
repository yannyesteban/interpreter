import { DBTransaction } from "./db/DBTransaction.js";
import { DBSql } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
import { JWT } from "./JWT.js";

interface IRecordKey {
    [key: string]: any;
}

interface IRecord {
    [key: string]: any;
}

export class Model {
    name: string;
    mode: string;
    response;
}

export class Form extends Element {
    private method: string;
    public panel: string;
    public id: string;
    public name: string;
    public element: string = "wh-html";
    public className: string | string[];
    public setPanel: string;
    public appendTo: string;

    private templateFile: string;

    private response: object = {};

    store: Store = null;

    private query: string;
    private db: DBSql;

    private connection: string = "mysql";
    private _info: any;
    private fields;
    private layout: any;

    private data;
    private datafields;
    private dataFetch;
    private dataLists;

    private _data;
    private params: any = {};

    private record;
    private mode;
    private scheme;
    private keyToken;
    private dataRecord;
    private recordKey;
    private to;

    keySecret = "Robin Williams";
    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {
        this._info = info;
        //this._info = this.store.loadJsonFile(info.source) || {};

        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }

    async evalMethod(method: string) {
        this.method = method;
        if (this._info.methods && this._info.methods[method]) {
            this._info = { ...this._info, ...this._info?.methods[method] };
        }

        switch (method) {
            case "list":
                const page = this.store.getSes("__page_") || "1";
                await this.doGrid(Number(page));
                break;
            case "new-record":
                await this.doForm(1);
                break;
            case "request":
                await this.doForm(1);
                break;
            case "load-record":
                await this.doForm(2);
                break;
            case "request2":
                await this.evalFields();
                break;
            case "find":
                await this.find();
                break;
            case "data-fields":
                await this.doDataFields(this.params?.parent);
                break;
            case "save":
                await this.saveRecord();
                break;

            case "load-page":
                await this.loadPageInfo();
        }
    }

    private async doGrid(page: number) {
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
            info = await this._pageData(list);
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
    }

    private async loadPageInfo() {
        const list = this._info.listData;

        if (this.params?.filter) {
            list.filter = this.params?.filter;
        }

        let pageData = await this._pageData(list);

        this.doResponse({
            element: "grid",
            propertys: {
                pageData: { ...pageData, fields: this._info.fields },
                //f: await this.evalDataFields(this.datafields),
            },
        });
    }

    private doKeyRecord(record1, data) {
        const record = ["employeeNumber"];

        const key = record.reduce((acc, e) => ((acc[e] = data[e]), acc), {});

        return key;
    }

    private async _pageData(info) {
        let data: any[] = [];
        let totalRecords = 0;
        if (info.sql) {
            const db = (this.db = this.store.db.get<DBSql>(this.connection));
            let filters = [];
            let values = [];

            if (this.params?.filter) {
                if (info.searchIn) {
                    info.searchIn.forEach((e) => {
                        filters.push(`${e} like concat('%',?,'%')`);
                        values.push(info.filter);
                    });

                    info.sql += " WHERE " + filters.join(" OR ");
                }
            }

            let result = await db.query(db.doQueryAll(info.sql), values);
            if (result.rows.length > 0) {
                totalRecords = result.rows[0].total;
                const totalPages = Math.ceil(totalRecords / info.limit);

                if (info.page > totalPages) {
                    info.page = totalPages;
                }
            }

            result = await db.query(info, values);

            const record = ["id"];

            if (result.rows) {
                data = result.rows.map((row, index) => ({
                    ...row,
                    __mode_: 2,
                    __key_: this.genToken(this.doKeyRecord({}, row)),
                }));
            }
        }

        return {
            data,
            totalRecords,
            page: info.page,
            limit: info.limit,
            filter: info.filter,
        };
    }

    private async doForm(mode) {
        const page = this.params["page"] || this.store.getReq("__page_") || 1;
        const filter = this.params["filter"] || this.store.getReq("__filter_");

        this.db = this.store.db.get<DBSql>(this.connection);
        let data = this._info.defaultData || {};

        data.__page_ = page;
        data.__filter_ = filter;

        const key = this.getRecordKey();

        if (key) {
            data = { ...data, ...(await this.getDBRecord(this._info.data, key)) };
        }

        data = { ...data, __mode_: mode, ...(this._info.fixedData || {}) };

        if (+mode != 1) {
            data.__key_ = this.genToken(key);
        }
        this._data = data;

        if (this._info.nav) {
            this.layout.elements.push(this._info.nav);
        }

        this.layout.dataLists = await this.getDataList();
        this.layout.appRequests = this.appRequests("list");
        this.layout.data = data;
        this.configInputs().forEach((item) => this.layout.elements.push(item));

        this.doResponse({
            element: "form",
            propertys: {
                dataSource: this.layout,
            },
        });
    }

    addRequest(type, info) {}

    private async getDataRecord(info) {
        //info = JSON.parse(this.store.evalSubData(JSON.stringify(info), this._data));

        if (info.sql) {
            const rows = (await this.db.query(info.sql, info.params ?? undefined)).rows;
            if (rows.length > 0) {
                return rows[0];
            }
        }

        return {};
    }

    private async find() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));
        let data = await this.getDataRecord(this.dataRecord);
        this._data = data;
        let key;

        if (this.recordKey) {
            key = {
                record: this.recordKey.reduce(
                    (a: object, fieldName: string) => ((a[fieldName] = data[fieldName]), a),
                    {},
                ),
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
                    data: await this.evalData(d.data),
                    childs: d.childs,
                    parent: d.parent,
                    mode: d.mode,
                    value: data[d.name],
                });
            }

            this.layout.dataLists = output;
        }

        this.layout.appRequests = this.appRequests("list");

        this.layout.elements.push(
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
                label: "__key_",
                input: "input",
                name: "__key_",
            },
        );
        this.doResponse({
            element: "form",
            propertys: {
                dataSource: this.layout,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        });
    }

    private async saveRecord() {
        const key = this.getRecordKey();
        const scheme = this._info.schemes[0];
        const schemeName = "any";

        const config = {
            db: "mysql",
            transaction: true,
            schemes: [{ ...scheme, name: schemeName }],
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

        const result = await transaction.save(dataset, {});

        let message = "";
        let keyToken = "";
        if (result.error) {
            message = result.error;
            this.store.setSes("__error_", true);
        } else {
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
            log: { ...result },

            message,
        });
    }

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
            data: await this.evalData(info.data),
            childs: info.childs,
            parent: info.parent,
            mode: info.mode,
        };
    }

    private async doDataFields(parent) {
        this._data = this.store.getVReq();

        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        const list = this.dataLists.filter((data) => data.parent == parent) || [];

        const output = await this.getDataFields(list);

        this.doResponse({
            element: "form",
            propertys: {
                dataFields: output,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        });
    }

    private async evalDataFields(dataFields) {
        const result = {};
        for (const [field, dataField] of Object.entries(dataFields)) {
            result[field] = {
                data: await this.evalData(dataField),
            };
        }

        return result;
    }

    private async evalData(dataField) {
        dataField = JSON.parse(this.store.evalSubData(JSON.stringify(dataField), this._data));

        let info = [];
        for (const data of dataField) {
            if (Array.isArray(data)) {
                info.push({ value: data[0], text: data[1], level: data[2] ?? undefined });
            } else if (typeof data === "object") {
                if (data.sql) {
                    let result = (await this.db.query(data.sql, data.params ?? undefined)).rows;
                    info = [...info, ...result];
                } else if (data.value && data.text) {
                    info.push(data);
                }
            }
        }

        return info;
    }

    private async evalFields() {
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
    }

    private genToken(payload) {
        if (!payload) {
            return "";
        }

        const jwt = new JWT({ key: this.keySecret });
        return jwt.generate(payload);
    }

    private decodeToken(token) {
        const jwt = new JWT({ key: this.keySecret });
        return jwt.verify(token);
    }

    private getRecordKey(): IRecordKey {
        let key: IRecordKey;
        const keyToken = this.params.__key_ || this.store.getReq("__key_") || this.store.getSes("__key_");

        if (keyToken) {
            key = this.decodeToken(keyToken);
        } else {
            key = this.params.__record_ || this.store.getReq("__record_") || this.store.getSes("__record_");
        }

        return key;
    }

    private async getDBRecord(info, key: IRecordKey): Promise<IRecord> {
        let query = info.sql;

        let conditions = [];
        let values = [];
        const record = this._info.data.record.forEach((field) => {
            conditions.push(field + "= ?");
            values.push(key[field]);
        });

        query += " WHERE " + conditions.join(" AND ");

        const data = await this.db.query(query, values);

        return data.rows[0] || {};
    }

    private async getDataList() {
        const dataList = [];
        if (this.dataLists) {
            for (const d of this.dataLists) {
                dataList.push({
                    name: d.name,
                    data: await this.evalData(d.data),
                    childs: d.childs,
                    parent: d.parent,
                    mode: d.mode,
                    value: this._data[d.name],
                });
            }
        }

        return dataList;
    }

    private appRequests(type?: string) {
        const requests = {
            dataField: {
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

    private configInputs() {
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
