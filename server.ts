import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";

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

    const ast = new AST(tokens);

    const statements = ast.parse();
    console.log("result", statements);
    console.log("bye", JSON.stringify(statements));
    res.write(JSON.stringify(statements));

    res.end(); //end the response
  });

}).listen(8080); //the server object listens on port 8080 