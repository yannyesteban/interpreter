import { DBSql } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";

export class Form extends Element {
    public id: string;
    public name: string;
    public element: string = "wh-html";
    public className: string | string[];
    public setPanel: string;
    public appendTo: string;

    templateFile: string;

    response: object[] = [];

    store: Store = null;

    private query: string;
    private db: DBSql;

    private connection: string = "mysql";
    private _info: any;
    private fields;
    private layout:any;
    setStore(store: Store) {
        this.store = store;
    }

    init(info: InfoElement) {
        //this._info = this.store.loadJsonFile(info.source) || {};

        console.log("...",info)

        for (const [key, value] of Object.entries( info )) {
            this[key] = value;
        }
    }

    async evalMethod(method: string) {
        switch (method) {
            case "request":
                await this.load();
                break;
            case "request2":
                await this.evalFields();
                break;
        }
    }

    async form() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        let result = await db.infoTable("person");

        this.addResponse({
            logs: result,
        });

        let result1 = await db.query("select a,b,c, d as x, 123 as num, id as f from person");
        this.addResponse({
            logs: result1,
        });
    }
    async load() {
        const data = {
            mode: "init",
            type: "element",
            wc: "gt-form",
            id: this.id,
            props: {
                dataSource: this.layout,
            },
            //replayToken => $this->replayToken,
            appendTo: this.appendTo,
            setPanel: this.setPanel,
        };

        this.addResponse(data);
    }

    getResponse(): object[] {
        return this.response;
    }

    addResponse(response) {
        this.response.push(response);
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
