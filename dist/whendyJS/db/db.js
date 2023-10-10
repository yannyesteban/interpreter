export class DB {
}
export var RecordMode;
(function (RecordMode) {
    RecordMode[RecordMode["NONE"] = 0] = "NONE";
    RecordMode[RecordMode["INSERT"] = 1] = "INSERT";
    RecordMode[RecordMode["UPDATE"] = 2] = "UPDATE";
    RecordMode[RecordMode["DELETE"] = 3] = "DELETE";
    RecordMode[RecordMode["UPSERT"] = 4] = "UPSERT";
})(RecordMode || (RecordMode = {}));
export class STMT {
}
export class DBEngine {
}
export class DBSqll {
}
//# sourceMappingURL=db.js.map