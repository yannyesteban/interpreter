import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";
var source = '2+3*6;';
var lexer = new Lexer(source);
var tokens = lexer.getTokens();
console.log(source, "\n", tokens);
var ast = new AST(tokens);
var statements = ast.parse();
console.log("result", statements);
console.log("bye", JSON.stringify(statements));
//# sourceMappingURL=main.js.map