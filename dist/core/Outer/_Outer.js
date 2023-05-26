import { Lexer } from "../Lexer.js";
import { Parser } from "./Parser.js";
var Data = /** @class */ (function () {
    function Data(token, data, pre) {
        this.token = token;
        this.data = data;
        this.pre = pre;
    }
    return Data;
}());
var Outer = /** @class */ (function () {
    function Outer(source) {
        this.source = source;
        this.output = source;
        this.data = [];
    }
    Outer.prototype.setMap = function (token, data, pre) {
        this.data.push(new Data(token, data, pre));
    };
    Outer.prototype.interprete = function (source) {
    };
    Outer.prototype.getDate = function (str) {
        var aux = str.split("-");
        return new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
    };
    Outer.prototype.evalMods = function (data, mods) {
        var _this = this;
        var _a;
        var aux = {};
        mods.forEach(function (m) {
            var _a;
            switch (m.mod.toLowerCase()) {
                case "trim":
                    data = data.toString();
                    if (m.value) {
                        if (m.value.toLowerCase() == "left") {
                            data = data.trimStart();
                        }
                        else if (m.value.toLowerCase() == "right") {
                            data = data.trimEnd();
                        }
                    }
                    else {
                        data = data.trim();
                    }
                    break;
                case "upper":
                    data = data.toString().toUpperCase();
                    break;
                case "lower":
                    data = data.toString().toLowerCase();
                    break;
                case "floor":
                    data = Math.floor(Number(data)).toString();
                    break;
                case "ceil":
                    data = Math.ceil(Number(data)).toString();
                    break;
                case "abs":
                    data = Math.abs(Number(data)).toString();
                    break;
                case "digits":
                    aux["format"] = true;
                    aux["locales"] = aux["locales"];
                    aux["digits"] = m.value || 2;
                    break;
                case "format":
                    aux["format"] = true;
                    aux["locales"] = m.value;
                    if (aux["digits"] == undefined) {
                        aux["digits"] = 2;
                    }
                    break;
                case "date":
                    data = _this.getDate(data.toString()).toLocaleDateString((_a = m.value) === null || _a === void 0 ? void 0 : _a.replace("_", "-"));
                    break;
                case "tofixed":
                    data = Number(data).toFixed(Number(m.value || 0));
                    break;
                case "pretty":
                    if (typeof data === "object") {
                        data = JSON.stringify(data, null, 2);
                    }
                    break;
            }
        });
        if (aux["format"]) {
            return new Intl.NumberFormat((_a = aux["locales"]) === null || _a === void 0 ? void 0 : _a.replace("_", "-"), {
                minimumFractionDigits: aux["digits"],
                maximumFractionDigits: aux["digits"]
            }).format(Number(data));
        }
        if (typeof data == "number") {
            return data.toString();
        }
        if (typeof data == "object") {
            return JSON.stringify(data);
        }
        return data;
    };
    Outer.prototype.eval = function (expressions) {
        var _this = this;
        var delta = 0;
        expressions.forEach(function (e) {
            _this.data.forEach(function (d) {
                if (e.token == d.token) {
                    var data = void 0;
                    var value = void 0;
                    data = d.data;
                    for (var i = 0; i < e.path.length; i++) {
                        if (data[e.path[i]]) {
                            value = data[e.path[i]];
                            data = value;
                        }
                        else {
                            return;
                        }
                    }
                    value = _this.evalMods(value, e.mods);
                    e.ready = true;
                    e.pos += delta;
                    _this.output = _this.output.substring(0, e.pos - 1) + value + _this.output.substring(e.pos - 1 + e.length);
                    delta = delta + (value.length - e.length);
                }
            });
        });
        console.log("expressions\n", expressions);
        return this.output;
    };
    Outer.prototype.run = function () {
        console.log("data\n", this.data);
        console.log("source:\n", this.source);
        var lexer = new Lexer(this.source, false);
        var tokens = lexer.getTokens();
        console.log(tokens);
        var parser = new Parser(tokens);
        var expressions = parser.parse();
        console.log("...", expressions);
        return this.eval(expressions);
    };
    return Outer;
}());
export { Outer };
//# sourceMappingURL=_Outer.js.map