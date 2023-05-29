import { Lexer } from "../Lexer.js";
import { Parser, ExpressionType } from "./Parser.js";
var Data = /** @class */ (function () {
    function Data(token, data, pre) {
        this.token = token;
        this.data = data;
        this.pre = pre;
    }
    return Data;
}());
var Outer = /** @class */ (function () {
    function Outer() {
        this.data = [];
    }
    Outer.prototype.setMap = function (token, data, pre) {
        this.data.push(new Data(token, data, pre));
    };
    Outer.prototype.getDate = function (date) {
        if (typeof date === "string") {
            var aux = date.split("-");
            return new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
        }
        if (date instanceof Date) {
            return date;
        }
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
                    data = _this.getDate(data).toLocaleDateString((_a = m.value) === null || _a === void 0 ? void 0 : _a.replace("_", "-"));
                    break;
                case "time":
                    data = _this.getDate(data).toLocaleTimeString();
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
        var delta = 0;
        var _loop_1 = function (e) {
            var value = null;
            if (e.type === ExpressionType.VAR) {
                this_1.data.forEach(function (d) {
                    if (e.token == d.token) {
                        var data = d.data;
                        for (var i = 0; i < e.path.length; i++) {
                            if (data[e.path[i]] !== undefined) {
                                value = data[e.path[i]];
                                data = value;
                            }
                            else {
                                return;
                            }
                        }
                    }
                });
            }
            else if (e.type === ExpressionType.DATE) {
                value = new Date();
            }
            if (value === null) {
                return "continue";
            }
            value = this_1.evalMods(value, e.mods);
            e.ready = true;
            e.pos += delta;
            this_1.output = this_1.output.substring(0, e.pos - 1) + value + this_1.output.substring(e.pos - 1 + e.length);
            delta = delta + (value.length - e.length);
        };
        var this_1 = this;
        for (var _i = 0, expressions_1 = expressions; _i < expressions_1.length; _i++) {
            var e = expressions_1[_i];
            _loop_1(e);
        }
        ;
        return this.output;
    };
    Outer.prototype.execute2 = function (source) {
        this.output = source;
        var x = source.indexOf("{");
        var subToken = source.charAt(x + 1);
        var lexer = new Lexer(source, false);
        var tokens = [];
        if (subToken == "@" || subToken == "#" || subToken == "$" || subToken == "&") {
            tokens = lexer.getTokens();
        }
        var parser = new Parser(tokens);
        var expressions = parser.parse();
        return this.eval(expressions);
    };
    Outer.prototype.execute = function (source) {
        this.output = source;
        var lexer = new Lexer(source, false);
        lexer.isLeftDelim = function () {
            console.log("PeeK", this.peek());
            var x = this.input.indexOf("{");
            if (x >= 0) {
                var y = this.input.charAt(x + 1);
                if (y == "@") {
                    return true;
                }
            }
            return false;
        };
        lexer.isRightDelim = function () {
            console.log("PeeK", this.peek());
            if (this.peek() == "}") {
                return true;
            }
            return false;
        };
        var tokens = lexer.getTokens2();
        return;
        var parser = new Parser(tokens);
        var expressions = parser.parse();
        return this.eval(expressions);
    };
    return Outer;
}());
export { Outer };
//# sourceMappingURL=Outer.js.map