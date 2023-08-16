import { DBSql } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";

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

    _data;
    eparams;

    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {
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
            case "data-fields":
                await this.doDataFields(this.eparams?.parent);
                break;
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
        this.layout.data = data.rows[0];
        if (this.datafields) {
            this.layout.dataLists = await this.evalDataFields(this.datafields);
        }
        const output = [];
        if (this.dataFetch) {
            //console.log(this.dataFetch)

            for (const d of this.dataFetch) {
                output.push({
                    name: d.name,
                    data: await this.evalData(d.data),
                    childs: d.childs,
                    parent: d.parent,
                    mode: d.mode,
                });
            }
            //console.log(output)
            this.layout.dataFields = output;
        }

        //this.addResponse(data);
        this.response = {
            element: "form",
            propertys: {
                dataSource: this.layout,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        };
    }

    async getDataFields(list){
        const output = [];
        for (const info of list) {
            output.push(await(this.getDataField(info)));
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
        console.log("doDataFields", parent)
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        const list = this.dataFetch.filter((data) => data.parent == parent) || [];
        console.log(list)
        const output = await this.getDataFields(list);
        console.log("output-->", output)
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
        console.log(this._data);
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
        this.addResponse({
            logs: section,
            con: mainElements,
        });
    }
}
