import { Lexer } from "./core/Lexer.js";
import { Parser } from "./core/Parser.js";

import   "./core/Resolver.js";
import   "./core/Interpreter.js";

import * as fs from 'fs';
import { Interpreter } from "./core/Interpreter.js";
import { Resolver } from "./core/Resolver.js";



fs.readFile("sevian.sv", (err, buff) => {
    if (err) {
        console.error(err);
        return;
    }

    //console.log("INTERPRETER V0.1");return;

    const source = buff.toString();
    const lexer = new Lexer(source);

    const tokens = lexer.getTokens();

    //console.log("source: ", source, "\n", tokens);
    console.clear();
    console.log("source: ", source, "\n");

    const parser = new Parser(tokens);

    const statements = parser.parse();
    //console.log("result", statements);
    //console.log("bye", JSON.stringify(statements));

    const intp = new Interpreter();
    const resolver = new Resolver(intp);
    resolver.resolve(statements);
    

    intp.interpret(statements);
});


