var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RecordMode } from "./db.js";
export class DBTransaction {
    constructor(config, dbAdmin) {
        this.dbAdmin = dbAdmin;
        this.config = config;
        this.db = dbAdmin.get(config.db);
        this.schemes = config.schemes.reduce((a, b) => {
            a[b.name] = b;
            return a;
        }, {});
        this.save(config.dataset, (config === null || config === void 0 ? void 0 : config.masterData) || {});
    }
    save(dataset, master) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.db;
            for (const info of dataset) {
                const scheme = this.schemes[info.scheme];
                const mode = info.mode;
                let result;
                if (mode === RecordMode.DELETE) {
                    result = yield db.deleteRecord({
                        table: scheme.table,
                        record: info.record,
                    });
                    continue;
                }
                const data = info.data;
                //const find = scheme.fields.find(e => e.serial);
                const keys = scheme.fields.filter((e) => e.key);
                const recordId = keys.reduce((acc, value) => {
                    return Object.assign(Object.assign({}, acc), { [value.name]: value });
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
                        }
                        else if (field.type == "C") {
                            value = "";
                        }
                        else {
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
                    result = yield db.insertRecord({
                        table: scheme.table,
                        serial: serialField,
                        data: newData,
                    });
                }
                else if (mode === RecordMode.UPDATE) {
                    result = yield db.updateRecord({
                        table: scheme.table,
                        serial: serialField,
                        data: newData,
                        record: info.record,
                    });
                }
                else if (mode === RecordMode.UPSERT) {
                    result = yield db.upsertRecord({
                        table: scheme.table,
                        serial: serialField,
                        data: newData,
                    });
                }
                console.log("result::::", mode, result);
                if ((result === null || result === void 0 ? void 0 : result.lastId) && serialField) {
                    recordId[serialField] = result.lastId;
                }
                if (info.detail) {
                    this.save(info.detail, Object.assign(Object.assign({}, master), data));
                }
            }
        });
    }
}
//# sourceMappingURL=DBTransaction.js.map