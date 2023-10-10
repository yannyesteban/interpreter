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
    scheme?: ISchemeInfo;
}

export interface ISchemeInfo {
    name?: string;
    table?: string;
    keys?: string[];
    fields?: IFieldInfo[];
    subrecord: ISchemeInfo;
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
    scheme?: ISchemeInfo;
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

    private scheme: ISchemeInfo;

    result: any;

    constructor(config: DBSaveInfo, db: DBEngine) {
        this.db = db;
        this.transaction = config.transaction || false;
    }

    async save(scheme: ISchemeInfo, dataset: any[], master?: {}) {
        const db = this.db;
        
        const table = scheme.table;

        let error: string = "";
        let errno: number = 0;
        let lastId: number = null;
        let record: { [key: string]: any } = {};

        let recordId: any;

        const subRecords = [];

        for (const data of dataset) {
            const mode = +data.__mode_;
            const key = data.__key_;
            let result: STMTResult;

            if (mode === RecordMode.DELETE) {
                result = await db.deleteRecord({
                    table: table,
                    record: key,
                });

                error = result.error;
                errno = result.errno;
                //record = info.record;

                continue;
            }

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

                if (field.type == "detail") {
                    subRecords.push({
                        scheme: field.scheme,
                        data: value,
                    });
                    return;
                }

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
                    record: key,
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

            if (scheme.subrecord) {
                const sub = new DBTransaction({ scheme: scheme.subrecord }, this.db);

                const result = await sub.save(scheme.subrecord, [data], {});
                this.save(data, { ...master, ...data });
            }

            if (subRecords.length > 0) {
                for (const subInfo of subRecords) {
                    const sub = new DBTransaction({ scheme: subInfo.scheme }, this.db);

                    const result = await sub.save(subInfo.data, { ...master, ...data });
                }
            }
        }

        return { error, errno, lastId, record, recordId };
    }
}
