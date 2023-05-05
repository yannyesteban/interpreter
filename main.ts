import { Lexer } from "./core/Lexer.js";
import { AST } from "./core/AST.js";

const source = '2+3*6;';
const lexer = new Lexer(source);

const tokens = lexer.getTokens();

console.log(source, "\n", tokens);


const ast = new AST(tokens);

const statements = ast.parse();
console.log("result", statements);
console.log("bye", JSON.stringify(statements));