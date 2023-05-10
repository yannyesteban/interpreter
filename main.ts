import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";

import   "./core/Resolver.js";
import   "./core/Interpreter.js";

import * as fs from 'fs';
import { Interpreter } from "./core/Interpreter.js";



fs.readFile("sevian.sv", (err, buff) => {
    if (err) {
        console.error(err);
        return;
    }

    //console.log("INTERPRETER V0.0");return;

    const source = buff.toString();
    const lexer = new Lexer(source);

    const tokens = lexer.getTokens();

    //console.log("source: ", source, "\n", tokens);
    console.log("source: ", source, "\n");

    const ast = new AST(tokens);

    const statements = ast.parse();
    //console.log("result", statements);
    //console.log("bye", JSON.stringify(statements));
    
    const intp = new Interpreter();

    intp.interpret(statements);
});


