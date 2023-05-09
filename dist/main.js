import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";
import "./core/Resolver.js";
import "./core/Interpreter.js";
import * as fs from 'fs';
fs.readFile("sevian.sv", function (err, buff) {
    if (err) {
        console.error(err);
        return;
    }
    console.log();
    var source = buff.toString();
    var lexer = new Lexer(source);
    var tokens = lexer.getTokens();
    console.log(source, "\n", tokens);
    var ast = new AST(tokens);
    var statements = ast.parse();
    console.log("result", statements);
    console.log("bye", JSON.stringify(statements));
});
//# sourceMappingURL=main.js.map