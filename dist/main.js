import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";
import "./core/Resolver.js";
import "./core/Interpreter.js";
import * as fs from 'fs';
import { Interpreter } from "./core/Interpreter.js";
fs.readFile("sevian.sv", function (err, buff) {
    if (err) {
        console.error(err);
        return;
    }
    //console.log("INTERPRETER V0.0");return;
    var source = buff.toString();
    var lexer = new Lexer(source);
    var tokens = lexer.getTokens();
    //console.log("source: ", source, "\n", tokens);
    console.log("source: ", source, "\n");
    var ast = new AST(tokens);
    var statements = ast.parse();
    //console.log("result", statements);
    //console.log("bye", JSON.stringify(statements));
    var intp = new Interpreter();
    intp.interpret(statements);
});
//# sourceMappingURL=main.js.map