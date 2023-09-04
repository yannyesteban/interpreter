import { DBTransaction } from "./db/DBTransaction.js";
import { DBSql } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
import { JWT } from "./JWT.js";
import { type } from "os";



export class Model {
    name: string;
    mode: string;
    response;
}

export class Form extends Element {
    public panel: string;
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
        //console.log("eparams..", method, this.eparams);
        
        switch (method) {
            case "new-record":
                await this.newRecord();
                break;
            case "request":
                await this.load();
                break;
            case "load-record":
                await this.loadRecord();
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

        

        const list = this._info.listData;

        let info;
        let totalRecords = null;

        if (list) {
            info = await this._pageData(list)
        }

        
        const appRequests = this._appRequests("list");

        
        const dataSource = {
            caption: "hello Mundo",
            data: info.data,
            fields,
            limit: +list.limit,
            page: +list.page,
            records: +info.totalRecords,
            maxPages: +list.maxPages || 6,
            filter: list.filter,
            nav:{
                elements:[
                    {
                        "type": "button",
                        "label": "+",
                        "className": "",
                        "action": "new",
                        "request": {},
                        "click": ""
                    },
                    {
                        type:"button",
                        label:"save",
                        className:"",
                        action:"save",
                        "request":{},
                        click:""
                    },
                    {
                        type:"button",
                        label:"Delete Record",
                        className:"",
                        action:"delete-record",
                        "request":{},
                        click:""
                    },
                    {
                        type:"button",
                        label:"Edit",
                        className:"",
                        action:"edit-record",
                        "request":{},
                        click:""
                    }
                ]
            },
            appRequests
        };

        this.doResponse({
            element: "grid",
            propertys: {
                dataSource,
                //f: await this.evalDataFields(this.datafields),
                output: info.data,
            },
            log:"yanny esteban",
        })

        
    }

    async loadPageInfo(){

        const list = this._info.listData;

        if(this.eparams?.filter){
            list.filter = this.eparams?.filter
        }


        

        let pageData = await this._pageData(list);

        

        //console.log("--------------------", this._pageData(list))
        this.doResponse({
            element: "grid",
            propertys: {
                pageData : {...pageData, fields: this._info.fields},
                //f: await this.evalDataFields(this.datafields),
                
            },
        });
        
    }


    doKeyRecord(record1, data){
        const record = ["employeeNumber"]

        const key = record.reduce((acc, e)=>(acc[e]=data[e], acc),{})
        //console.log(data, "................",key)
        return key
    }

    async _pageData(info){
        let data:any[] = []
        let totalRecords = 0;
        if (info.sql) {
            const db = (this.db = this.store.db.get<DBSql>(this.connection));
            let filters = []
            let values = []

            
            if(this.eparams?.filter){
                
                if(info.searchIn){
                    info.searchIn.forEach(e=>{
                        filters.push(`${e} like concat('%',?,'%')`)
                        values.push(info.filter)
                    })

                    info.sql += " WHERE "+filters.join(" OR ")
                }
    
                
    
                
            }
            

            let result = await db.query(info, values);

            const record = ["id"]

            
            if (result.rows) {

                
                data = result.rows.map((row, index) => ({ ...row, __mode_: 2, __key_: this.genToken(this.doKeyRecord({}, row)) }));
            }

            //console.log(data)

            
            result = await db.query(db.doQueryAll(info.sql), values);
            if (result.rows.length > 0) {
                totalRecords = result.rows[0].total;
            }
        }

        return {
            data, totalRecords, page:info.page, limit: info.limit, filter: info.filter
        }
    }

    async newRecord() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));




        
        this.layout.data = {
            __mode_:1
        };
        this._data = this.layout.data
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
                    //value: this.layout.data[d.name],
                });
            }
            //console.log(output)
            this.layout.dataLists = output;
        }

        

        this.layout.appRequests =this._appRequests("list");
        
       
        
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

    async load() {
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        let result = await db.infoTable("cities");

        

        let data = await db.query(this.data);
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

        

        this.layout.appRequests =  this._appRequests("list");

        
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
        );
        this.doResponse({
            element: "form",
            propertys: {
                dataSource: this.layout,
                //f: await this.evalDataFields(this.datafields),
                output,
            },
        });
        /*
        const f:any = {};
        f.setComponent("form", {datasource:{}})
        f.addMessage({
            "className":"yes",
            "type":"error",
            "title":"hello",
            "message":"welcome",
            "okButton":"Aceptar"

        })
        */
    }

    addRequest(type, info){

        /*
        

        this.addRequest("message",{caption:"hello", text:"error"})
        this.addRequest(request.do,{caption:"hello", text:"error"})

        */

        return {
            type:"set-panel",
            element:"form",
            id:this.id,
            
            
        }

    }

    async loadRecord() {

        //console.log(this._info.recordData)

        let query = this._info.recordData.sql
        const key = this.decodeToken(this.store.getSes("__key_"))


        let conditions = []
        let values = []
        const record = this._info.recordData.record.forEach(field=>{
            conditions.push(field + "= ?")
            values.push(key[field])
        })

        query += " WHERE " + conditions.join(" AND ");
        const db = (this.db = this.store.db.get<DBSql>(this.connection));

        //console.log("__key_......",this.decodeToken(this.store.getSes("__key_")))

        let data = await db.query(query, values);
        this._data = data.rows[0];
        this._data["state_id"] = 2040;
        this._data["city_id"] = 130165;
        this._data["__mode_"] = this.mode;
        this._data["__key_"] = this.store.getSes("__key_")//JSON.stringify(this.record);
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

        

        this.layout.appRequests =this._appRequests("list");

        
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

    async getDataRecord(info) {
        
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

        

        this.layout.appRequests = this._appRequests("list");
        
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

    async transaction() {
        const token = this.store.getReq("__key_");
        const jwt = new JWT({ key: "yanny" });
        const key = jwt.verify(token);
        
        

        const json = {
            db: "mysql",
            transaction: true,
            schemes: [{ ...this.scheme, name: this.name }],
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

        this.doResponse({
            element: "form",
            propertys: {
                //f: await this.evalDataFields(this.datafields),
                output: "SAVE FORM",
            },
        });
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

    private genToken(payload){
        const jwt = new JWT({ key: "yanny" });
        return jwt.generate(payload);
       

        
    }

    private decodeToken(token){
        const jwt = new JWT({ key: "yanny" });
        return jwt.verify(token)
       
    }

    private _appRequests(type?:string){
        console.log(this.panel)
        return {

            dataField: {
                //form: this,
                actions: [
                    {
                        do: "update",
                        api: "form",
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
                        do: "update",
                        api: "form",
                        id: this.id,
                        name: this.name,
                        method: "save",
                    },
                ],
            },
            delete: {
                //form: this,
                setFormValue:{
                    "__mode_":"3"
                },
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: this.id,
                        name: this.name,
                        method: "save",
                    },
                ],
            },
            list: {
                
                
                
                actions: [
                    {
                        do: "update",
                        api: "form",
                        id: this.id,
                        name: this.name,
                        method: "list",
                    },
                ],
            },

            "load-page": {
                //form: this,
                actions: [
                    {
                        do: "update",
                        api: "form",
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
                        do: "set-panel",
                        api: "form",
                        panel: this.panel,
                        id: this.id,
                        name: this.name,
                        method: "load-record",
                    },
                ],
            },
            "delete-record": {
                //form: this,
                confirm:"borrando!",
                setFormValue:{
                    "__mode_":"3",
                    
                },
                "store":{
                    "__page_":"1"
                },
                actions: [
                    {
                        do: "update",
                        api: "form",
                        panel:this.setPanel,
                        id: this.id,
                        name: this.name,
                        method: "save",
                    },
                    {
                        do: "set-panel",
                        api: "form",
                        
                        panel:this.setPanel,
                        id: this.id,
                        name: this.name,
                        method: "list",
                    },
                ],
            },
            "filter": {
                //form: this,
                actions: [
                    {
                        do: "update",
                        api: "form",
                        panel: this.panel,
                        id: this.id,
                        name: this.name,
                        method: "load-page",
                    },
                ],
            },
            "new": {
                //form: this,
                actions: [
                    {
                        do: "set-panel",
                        api: "form",
                        panel: this.panel,
                        id: this.id,
                        name: this.name,
                        method: "new-record",
                    },
                ],
            }
        }
    }
}
