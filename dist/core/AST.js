import { Lexer } from "./Lexer.js";
var source = 'if (3>=6) 6+6*2 || 2';
var lexer = new Lexer(source);
console.log(source, "\n", lexer.getTokens());
console.log("bye");
var AST = /** @class */ (function () {
    function AST(tokens) {
        this.tokens = tokens;
    }
    AST.prototype.parse = function () {
    };
    return AST;
}());
export { AST };
//# sourceMappingURL=AST.js.map