import { DBEngine, IRecordAdmin, IRecordInfo, RecordMode, STMTResult } from "./db.js";
import { DBAdmin } from "./dbAdmin.js";

export interface IFieldInfo {
    field?: string;
    name?: string;
    type?: string;
    key?: boolean;
    serial?: boolean;
    notNull?: boolean;
    default?: string | number | boolean;
    value?: string | number | boolean;
    modifiers?: string[];
    aux?: boolean;
    masterValue?: string;
    inputValue?: string;
    noUpdate?: boolean;
}

export interface ISchemeInfo {
    name?: string;
    table?: string;
    keys?: string[];
    fields?: IFieldInfo[];
}

export interface IDataInfo {
    scheme?: string;
    mode?: RecordMode;
    record?: {};
    data?: {};
    detail?: IDataInfo[];
}

export interface DBSaveInfo {
    db?: string;
    transaction?: boolean;
    schemes?: ISchemeInfo[];
    dataset?: IDataInfo[];
    masterData?: {};
}

export class DBTransaction {
    connection;
    transaction;

    private dbAdmin: DBAdmin;
    private db: DBEngine;
    private config;
    private schemes: { [name: string]: ISchemeInfo };

    
    result: any;

    constructor(config: DBSaveInfo, dbAdmin: DBAdmin) {
        this.dbAdmin = dbAdmin;

        this.config = config;

        this.db = dbAdmin.get<DBEngine>(config.db);

        this.schemes = config.schemes.reduce((a: any, b) => {
            a[b.name] = b;
            return a;
        }, {});

        //this.save(config.dataset, config?.masterData || {});
    }

    async save(dataset: IDataInfo[], master?: {}) {
        const db = this.db;

        let error: string = "";
        let errno: number = 0;
        let lastId: number = null;
        let record: { [key: string]: any } = {};

        let recordId :any;

        for (const info of dataset) {
            const scheme = this.schemes[info.scheme];
            const mode = info.mode;
            let result: STMTResult;

            if (mode === RecordMode.DELETE) {
                result = await db.deleteRecord({
                    table: scheme.table,
                    record: info.record,
                });

                error = result.error;
                errno = result.errno;
                record = info.record;

                continue;
            }

            const data = info.data;
            //const find = scheme.fields.find(e => e.serial);
            const keys = scheme.fields.filter((e) => e.key);
            recordId = keys.reduce((acc, value) => {
                return { ...acc, [value.name]: value };
            }, {});
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

                if (field.aux || (mode === RecordMode.UPDATE && field.noUpdate)) {
                    continue;
                }

                if (field.masterValue && field.masterValue in master) {
                    value = master[field.masterValue];
                }

                if (!value) {
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
                    table: scheme.table,
                    serial: serialField,
                    data: newData,
                });
            } else if (mode === RecordMode.UPDATE) {
                result = await db.updateRecord({
                    table: scheme.table,
                    serial: serialField,
                    data: newData,
                    record: info.record,
                });
            } else if (mode === RecordMode.UPSERT) {
                result = await db.upsertRecord({
                    table: scheme.table,
                    serial: serialField,
                    data: newData,
                });
            }

            if (result?.lastId && serialField) {
                recordId[serialField] = result.lastId;
                lastId = result.lastId;

                result[serialField];

                //console.log("result::::", mode, result);
            }

            //console.log("result::::", recordId, result);
            this.result = result;

            error = result.error;
            errno = result.errno;
            record = result.row;
            if (info.detail) {
                this.save(info.detail, { ...master, ...data });
            }
        }

        return { error, errno, lastId, record, recordId};
    }
}
