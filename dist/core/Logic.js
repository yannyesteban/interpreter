import { Lexer } from "./Lexer.js";
import { Parser } from "./Parser.js";
import { Resolver } from "./Resolver.js";
import { Interpreter } from "./Interpreter.js";
var Logic = /** @class */ (function () {
    function Logic() {
        this.output = "";
    }
    Logic.prototype.eval = function () {
    };
    Logic.prototype.execute = function (source) {
        this.output = source;
        var lexer = new Lexer(source);
        var setions = lexer.getSections("{:", ":}");
        var expressions = [];
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
            console.log(output);
        }
        //console.log(expressions)
        return expressions;
    };
    return Logic;
}());
export { Logic };
//# sourceMappingURL=Logic.js.map