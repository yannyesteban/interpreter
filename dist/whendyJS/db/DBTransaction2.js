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
    constructor(config, db) {
        this.db = db;
        this.transaction = config.transaction || false;
        this.scheme = config.scheme;
        //this.save(config.dataset, config?.masterData || {});
    }
    save(dataset, master) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.db;
            const scheme = this.scheme;
            const table = scheme.table;
            let error = "";
            let errno = 0;
            let lastId = null;
            let record = {};
            let recordId;
            const subRecords = [];
            for (const data of dataset) {
                console.log(data);
                const mode = +data.__mode_;
                const key = data.__key_;
                let result;
                if (mode === RecordMode.DELETE) {
                    result = yield db.deleteRecord({
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
                    return Object.assign(Object.assign({}, acc), { [value.name]: value });
                }, {});
                const newData = {};
                let serialField = null;
                for (const field of scheme.fields) {
                    const name = field.name;
                    let value = data[name];
                    if (field.type == "detail") {
                        subRecords.push({
                            name: name,
                            scheme: field.scheme,
                            data: value
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
                        record: key,
                    });
                }
                else if (mode === RecordMode.UPSERT) {
                    result = yield db.upsertRecord({
                        table: scheme.table,
                        serial: serialField,
                        data: newData,
                    });
                }
                if ((result === null || result === void 0 ? void 0 : result.lastId) && serialField) {
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
                    const result = yield sub.save([data], {});
                    this.save(data, Object.assign(Object.assign({}, master), data));
                }
                if (subRecords.length > 0) {
                    for (const subInfo of subRecords) {
                        const sub = new DBTransaction({ scheme: subInfo.scheme }, this.db);
                        const result = yield sub.save(subInfo.data, Object.assign(Object.assign({}, master), data));
                    }
                }
            }
            return { error, errno, lastId, record, recordId };
        });
    }
}
//# sourceMappingURL=DBTransaction2.js.map