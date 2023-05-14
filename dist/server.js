import { Lexer } from "./core/Lexer.js";
import { Parser } from "./core/Parser.js";
import * as fs from "fs";
import * as http from "http";
//create a server object:
http.createServer(function (req, res) {
    console.log("prueba");
    res.write('Hello World!'); //write a response to the client
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
        var ast = new Parser(tokens);
        var statements = ast.parse();
        console.log("result", statements);
        console.log("bye", JSON.stringify(statements));
        res.write(JSON.stringify(statements));
        res.end(); //end the response
    });
}).listen(8080); //the server object listens on port 8080 
//# sourceMappingURL=server.js.map