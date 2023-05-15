import { Lexer } from "./core/Lexer.js";
import { Parser } from "./core/Parser.js";
import "./core/Resolver.js";
import "./core/Interpreter.js";
import * as fs from 'fs';
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
    var parser = new Parser(tokens);
    var statements = parser.parse();
    //console.log("result", statements);
    //console.log("bye", JSON.stringify(statements));
    //const intp = new Interpreter();
    //intp.interpret(statements);
});
//# sourceMappingURL=main.js.map