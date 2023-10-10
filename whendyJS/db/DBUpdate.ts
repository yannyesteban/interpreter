import { DBEngine, IRecordAdmin, IRecordInfo, RecordMode, STMTResult } from "./db.js";
import { DBAdmin } from "./dbAdmin.js";

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
    noUpdate: boolean;
}

export interface ISchemeInfo {
    name: string;
    table: string;
    keys: string[];
    fields: IFieldInfo[];
}

export interface IDataInfo {
    scheme: string;
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
    masterData: {};
}

export class DBUpdate {
    connection;
    transaction;

    private db: DBEngine;
    private config;
    private schemes: { [name: string]: ISchemeInfo };

    constructor(config?: DBSaveInfo) {
        let dbAdmin = new DBAdmin();
        dbAdmin.init([
            {
                name: "mysql",
                driver: "mysql",
                host: "localhost",
                user: "root",
                pass: "123456",
                dbase: "whendy",
            },
            {
                name: "postgres",
                driver: "postgres",
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy",
            },
            {
                name: "sqlite",
                driver: "sqlite",
                host: "",
                user: "",
                pass: "",
                dbase: "./whendy.db",
            },
        ]);

        this.config = config;
        let db: DBEngine;
        let driver = "postgres";
        db = dbAdmin.get<DBEngine>(driver);

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
                    table: scheme.table,
                    record: info.record,
                });

                continue;
            }

            const data = info.data;
            //const find = scheme.fields.find(e => e.serial);
            const keys = scheme.fields.filter((e) => e.key);
            const recordId = keys.reduce((acc, value) => {
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

            console.log("result::::", mode, result);

            if (result?.lastId && serialField) {
                recordId[serialField] = result.lastId;
            }

            if (info.detail) {
                this.save(info.detail, { ...master, ...data });
            }
        }
    }
}
