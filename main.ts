import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";

import * as fs from 'fs';



fs.readFile("sevian.sv", (err, buff) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log();

    const source = buff.toString();
    const lexer = new Lexer(source);

    const tokens = lexer.getTokens();

    console.log(source, "\n", tokens);

    const ast = new AST(tokens);

    const statements = ast.parse();
    console.log("result", statements);
    console.log("bye", JSON.stringify(statements));
    
});


