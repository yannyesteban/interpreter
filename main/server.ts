import { Lexer } from "./core/Lexer.js";
import { Parser } from "./core/Parser.js";

import   "./core/Resolver.js";
import   "./core/Interpreter.js";


import { Interpreter } from "./core/Interpreter.js";


import * as fs from "fs";

import * as http from "http"

//create a server object:
http.createServer(function (req, res) {
  console.log("prueba")
  res.write('Hello World!'); //write a response to the client


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

    const parser = new Parser(tokens);

    const statements = parser.parse();
    console.log("result", statements);
    console.log("bye", JSON.stringify(statements));

    res.end(); //end the response
  });

}).listen(8080); //the server object listens on port 8080 