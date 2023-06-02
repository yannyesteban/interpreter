import { Lexer } from "./Lexer.js";
import { Parser } from "./Parser.js";
import { Resolver } from "./Resolver.js";
import { Interpreter } from "./Interpreter.js";
var Logic = /** @class */ (function () {
    function Logic() {
        this.output = "";
    }
    Logic.prototype.execute = function (source) {
        var lexer = new Lexer(source);
        var tokens = lexer.getTokens();
        var parser = new Parser(tokens);
        var statements = parser.parse();
        var interpreter = new Interpreter();
        var resolver = new Resolver(interpreter);
        var output = interpreter.interpret(statements);
        return output;
    };
    Logic.prototype.scan = function (source) {
        this.output = source;
        var lexer = new Lexer(source);
        var setions = lexer.getSections("{:", ":}");
        var expressions = [];
        var delta = 0;
        var offset;
        for (var _i = 0, setions_1 = setions; _i < setions_1.length; _i++) {
            var s = setions_1[_i];
            console.log(s);
            var parser = new Parser(s.tokens);
            var statements = parser.parse();
            var interpreter = new Interpreter();
            var resolver = new Resolver(interpreter);
            //resolver.resolve(statements);
            var output = interpreter.interpret(statements);
            s.output = output;
            s.pos += delta;
            offset = (s.outside && s.pos > 0) ? 1 : 0;
            this.output = this.output.substring(0, s.pos - offset) + output + this.output.substring(s.pos + s.length + offset);
            delta = delta + (output.length - s.length) + 2 * offset;
        }
        return this.output;
    };
    return Logic;
}());
export { Logic };
//# sourceMappingURL=Logic.js.map