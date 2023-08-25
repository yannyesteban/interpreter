import { DBTransaction } from "./db/DBTransaction.js";
import { DBSql } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
import { JWT } from "./JWT.js";

export class Model {
    name: string;
    mode: string;
    response;
}

export class Form extends Element {
    public id: string;
    public name: string;
    public element: string = "wh-html";
    public className: string | string[];
    public setPanel: string;
    public appendTo: string;

    templateFile: string;

    response: object = {};

    store: Store = null;

    private query: string;
    private db: DBSql;

    private connection: string = "mysql";
    private _info: any;
    private fields;
    private layout: any;

    data;
    datafields;
    dataFetch;
    dataLists;

    _data;
    eparams;

    record;
    mode;
    scheme;
    private keyToken;
    dataRecord;
    recordKey;
    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {
        this._info = info;
        //this._info = this.store.loadJsonFile(info.source) || {};

        //console.log("...", info);

        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }

    async evalMethod(method: string) {
        console.log("eparams..", method, this.eparams);
        switch (method) {
            case "request":
                await this.load();
                break;
            case "request2":
                await this.evalFields();
                break;
            case "find":
                await this.find();
                break;
            case "data-fields":
                await this.doDataFields(this.eparams?.parent);
                break;
            case "save":
                await this.transaction();
                break;
            case "list":
                const page = this.store.getSes("__page_") || "1";
                await this.list(Number(page));
                break;
            case "load-page":
                await this.loadPageInfo();
        }
    }

    async list(page: number) {
        const fields = this._info.fields.map((field) => ({
            name: field.name,
            label: field.label,
            type: field.cellType,
            cellWidth: field.cellWidth,
        }));

        console.log("listData...", this._info.listData);

        const list = this._info.listData;

        let info;
        let totalRecords = null;

        if (list) {
            info = await this._pageData(list)
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
                        method: "request",
                    },
                ],
            }
        }

        
        const dataSource = {
            caption: "hello Mundo",
            data: info.data,
            fields,
            limit: +list.limit,
            page: +list.page,
            records: +totalRecords,
            maxPages: +list.maxPages || 6,
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
    }

    async loadPageInfo(){
        const list = this._info.listData;

        let pageData = await this._pageData(list);

        

        //console.log("--------------------", this._pageData(list))
        this.response = {
            element: "grid",
            propertys: {
                pageData : {...pageData, fields: this._info.fields},
                //f: await this.evalDataFields(this.datafields),
                
            },
        };
    }

    async _pageData(info){
        let data:any[] = []
        let totalRecords = 0;
        if (info.sql) {
            const db = (this.db = this.store.db.get<DBSql>(this.connection));

            let result = await db.query(info);
            if (result.rows) {
                data = result.rows.map((row, index) => ({ ...row, __mode_: 2, __key_: this.genToken(index) }));
            }

            console.log(db.doQueryAll(info.sql));
            result = await db.query(db.doQueryAll(info.sql));
            if (result.rows.length > 0) {
                totalRecords = result.rows[0].total;
            }
        }

        return {
            data, totalRecords, page:info.page, limit: info.page
        }
    }

    async load() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        let result = await db.infoTable("cities");

        this.addResponse({
            logs: result,
        });

        let data = await db.query(this.data);
        this._data = data.rows[0];
        this._data["state_id"] = 2040;
        this._data["city_id"] = 130165;
        this._data["__mode_"] = this.mode;
        this._data["__record_"] = JSON.stringify(this.record);
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
                    data: await this.evalData(d.data),
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

        console.log("this.layout", this.layout);
        this.layout.elements.push(
            {
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            },
            {
                component: "field",
                label: "__record_",
                input: "input",
                name: "__record_",
            },
        );
        this.response = {
            element: "form",
            propertys: {
                dataSource: this.layout,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        };
    }

    async getDataRecord(info) {
        console.log("....", info);
        //info = JSON.parse(this.store.evalSubData(JSON.stringify(info), this._data));

        if (info.sql) {
            const rows = (await this.db.query(info.sql, info.params ?? undefined)).rows;
            if (rows.length > 0) {
                return rows[0];
            }
        }

        return {};
    }

    async find() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));
        let data = await this.getDataRecord(this.dataRecord);
        this._data = data;
        let key;
        console.log(this.dataRecord, "......", data);
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
        console.log(key, token);

        //employeeNumber

        data["__key_"] = token;
        data["__mode_"] = 2;

        //this._data["__record_"] = JSON.stringify(this.record);
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
                    data: await this.evalData(d.data),
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

        console.log("this.layout", this.layout);
        this.layout.elements.push(
            {
                component: "field",
                label: "__mode_",
                input: "input",
                name: "__mode_",
            },
            {
                component: "field",
                label: "__record_",
                input: "input",
                name: "__record_",
            },
            {
                component: "field",
                label: "__key_",
                input: "input",
                name: "__key_",
            },
        );
        this.response = {
            element: "form",
            propertys: {
                dataSource: this.layout,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        };
    }

    async transaction() {
        const token = this.store.getReq("__key_");
        const jwt = new JWT({ key: "yanny" });
        const key = jwt.verify(token);
        console.log(key, token);

        const json = {
            db: "mysql",
            transaction: true,
            schemes: [{ ...this.scheme, name: this.name }],
            dataset: [
                {
                    scheme: this.name,
                    mode: +this.store.getReq("__mode_"),
                    record: key.record,
                    data: this.store.getVReq(),
                },
            ],
            masterData: {},
        };

        console.log("JSON----->", JSON.stringify(json));
        const c = new DBTransaction(json, this.store.db);

        this.response = {
            element: "form",
            propertys: {
                //f: await this.evalDataFields(this.datafields),
                output: "SAVE FORM",
            },
        };
    }
    async getDataFields(list) {
        const output = [];
        for (const info of list) {
            output.push(await this.getDataField(info));
        }
        return output;
    }

    async getDataField(info) {
        return {
            name: info.name,
            data: await this.evalData(info.data),
            childs: info.childs,
            parent: info.parent,
            mode: info.mode,
        };
    }

    async doDataFields(parent) {
        this._data = this.store.getVReq();
        console.log("doDataFields", parent);
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        const list = this.dataLists.filter((data) => data.parent == parent) || [];
        console.log(list);
        const output = await this.getDataFields(list);
        console.log("output-->", output);
        this.response = {
            element: "form",
            propertys: {
                dataFields: output,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        };
    }

    getResponse(): any {
        return this.response;
    }

    addResponse(response) {
        //this.response.push(response);
    }

    async evalDataFields(dataFields) {
        const result = {};
        for (const [field, dataField] of Object.entries(dataFields)) {
            result[field] = {
                data: await this.evalData(dataField),
            };
        }

        return result;
    }

    async evalData(dataField) {
        console.log("que data -> ", this._data);
        dataField = JSON.parse(this.store.evalSubData(JSON.stringify(dataField), this._data));

        console.log("dataField.....", dataField);
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
        this.addResponse({
            logs: section,
            con: mainElements,
        });
    }

    private genToken(payload){
        const jwt = new JWT({ key: "yanny" });
        return jwt.generate(payload);


        
    }
}
