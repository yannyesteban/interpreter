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
    Outer.prototype.evalMods = function (data, mods) {
        mods.forEach(function (m) {
            switch (m.mod.toLowerCase()) {
                case "trim":
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
                    data = data.toUpperCase();
                    break;
                case "upper":
                    data = data.toUpperCase();
                    break;
                case "lower":
                    data = data.toLowerCase();
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
                case "tofixed":
                    data = Number(data).toFixed(Number(m.value || 0));
                    break;
            }
        });
        return data;
    };
    Outer.prototype.eval = function (expressions) {
        var _this = this;
        var delta = 0;
        expressions.forEach(function (e) {
            _this.data.forEach(function (d) {
                if (e.token == d.token) {
                    var data = void 0;
                    if (d.data[e.name]) {
                        data = d.data[e.name];
                        if (typeof data == "number") {
                            data = data.toString();
                        }
                        if (e.mods) {
                            data = _this.evalMods(d.data[e.name], e.mods);
                        }
                    }
                    else {
                        return;
                    }
                    e.ready = true;
                    e.pos += delta;
                    _this.output = _this.output.substring(0, e.pos - 1) + data + _this.output.substring(e.pos - 1 + e.length);
                    delta = delta + (data.length - e.length);
                    console.log(" pos : ", delta, e.pos);
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
//# sourceMappingURL=Outer.js.map