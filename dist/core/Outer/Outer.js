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
    }
    Outer.prototype.setMap = function (pre, data) {
    };
    Outer.prototype.interprete = function (source) {
    };
    Outer.prototype.run = function () {
        console.log("source:\n", this.source);
        var lexer = new Lexer(this.source);
        var tokens = lexer.getTokens();
        console.log(tokens);
        var parser = new Parser(tokens);
        console.log(parser.parse());
        return "RUN.";
    };
    return Outer;
}());
export { Outer };
//# sourceMappingURL=Outer.js.map