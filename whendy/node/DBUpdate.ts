import { DBAdmin, IDBAdmin, IRecordInfo, MysqlDB, PostgreDB, RecordMode, SQLiteDB, STMTResult } from "./db.js";

export interface IFieldInfo {
    field: string;
    name: string;
    type: string;
    key: boolean;
    serial: boolean;
    notNull: boolean;
    default: string | number | boolean;
    value: string | number | boolean;
    modifiers: string[];
    aux: boolean;
    masterValue: string;
    inputValue: string;
    noUpdate:boolean;
}

export interface ISchemeInfo {
    name: string;
    table: string;
    keys: string[];
    fields: IFieldInfo[];
}

export interface IDataInfo {
    scheme:string;
    mode: RecordMode;
    record: {};
    data: {};
    detail: IDataInfo[];
}

export interface DBSaveInfo {
    db: string;
    transaction: boolean;
    schemes: ISchemeInfo[];
    dataset: IDataInfo[];
    masterData: {}
}

export class DBUpdate {

    connection;
    transaction;

    private db: IDBAdmin;
    private config;
    private schemes:{[name:string]:ISchemeInfo};
    
    constructor(config?:DBSaveInfo) {
  
        this.config = config;
        let db: IDBAdmin;
        let driver = "mysql";
        
        if (driver == "mysql") {
            db = new MysqlDB({
                host: "localhost",
                user: "root",
                pass: "123456",
                dbase: "whendy"
            });
        } else if (driver == "postgres") {
            db = new PostgreDB({
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy"
            });

        } else if (driver == "sqlite") {
            db = new SQLiteDB({
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy"
            });
        }

        this.db = db;

        this.schemes = config.schemes.reduce((a, b) => {
            a[b.name] = b;
            return a;
        }, {});

        this.save(config.dataset, config?.masterData || {});
    }
    
    async save(dataset: IDataInfo[], master?: {}) {

        const db = this.db;

        for (const info of dataset) {
            
            const scheme = this.schemes[info.scheme];
            const mode = info.mode;
            let result: STMTResult;

            if (mode === RecordMode.DELETE) {
                result = await db.deleteRecord({
                    "table": scheme.table,
                    "record": info.record
                });

                continue;
            }
            
            const data = info.data;
            //const find = scheme.fields.find(e => e.serial);
            const keys = scheme.fields.filter(e => e.key)
            const recordId = keys.reduce((acc, value) => { return { ...acc, [value.name]: value } }, {});
            const newData = {};
            let serialField = null;
            
            for (const field of scheme.fields) {
                
                const name = field.name;
                let value = data[name];
                if (field.serial) {
                    serialField = name;
                }
                                
                if (name in recordId) {
                    recordId[name] = value;
                }

                if(field.aux || mode === RecordMode.UPDATE && field.noUpdate){
                    continue;
                }
 
                if (field.masterValue && field.masterValue in master) {
                    value = master[field.masterValue];
                }
                
                if(!value){
                    if (field.notNull && field.default) {
                        value = field.default;
                    } else if (field.type == "C") {
                        value = "";
                    } else {
                        value = null;
                    }
                }
 
                if (field.modifiers) {
                    
                    for (const m of field.modifiers) {
                        switch (m) {
                            case "upper":
                                value = String(value).toLocaleUpperCase();
                                break;
                            case "lower":
                                value = String(value).toLocaleLowerCase();
                                break;
                        }
                    }
                }

                newData[name] = value;
            }

            if (mode === RecordMode.INSERT) {
                
                result = await db.insertRecord({
                    "table": scheme.table,
                    "serial": serialField,
                    "data": newData
                });
               
            } else if (mode === RecordMode.UPDATE) {
                
                result = await db.updateRecord({
                    "table": scheme.table,
                    "serial": serialField,
                    "data": newData,
                    "record": info.record
                });
                
            } else if (mode === RecordMode.UPSERT) {
                result = await db.upsertRecord({
                    "table": scheme.table,
                    "serial": serialField,
                    "data": newData
                });
            }

            console.log("result:", result)
            
            if (result?.lastId && serialField) {
                recordId[serialField] = result.lastId;
            }
            
            if (info.detail) {
                this.save(info.detail, {...master, ...data});
            }
        }
    }
}
