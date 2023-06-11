import * as fs from 'fs';
export var LoadMode;
(function (LoadMode) {
    LoadMode[LoadMode["TEXT"] = 1] = "TEXT";
    LoadMode[LoadMode["JSON"] = 2] = "JSON";
    LoadMode[LoadMode["ARRAY"] = 3] = "ARRAY";
})(LoadMode || (LoadMode = {}));
export class Tool {
    static loadJsonFile(name) {
        return this.loadFile(name, LoadMode.JSON);
    }
    static loadFile(name, mode) {
        let source = fs.readFileSync(name, "utf8");
        if (!source) {
            console.error(source);
            return "error";
        }
        switch (mode) {
            case LoadMode.JSON:
                return JSON.parse(source);
            default:
                return source;
        }
    }
}
//# sourceMappingURL=tool.js.map