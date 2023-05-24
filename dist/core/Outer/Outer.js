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
    Outer.prototype.eval = function (expressions) {
        var _this = this;
        var delta = 0;
        expressions.forEach(function (e) {
            //console.log(e)
            _this.data.forEach(function (d) {
                if (e.token == d.token) {
                    if (d.data[e.name]) {
                        //console.log(d.data[e.name])
                        e.pos += delta;
                        _this.output = _this.output.substring(0, e.pos - 1) + d.data[e.name] + _this.output.substring(e.pos - 1 + e.length);
                        delta = delta + (d.data[e.name].length - e.length);
                        //console.log(delta, this.source);
                    }
                }
            });
        });
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