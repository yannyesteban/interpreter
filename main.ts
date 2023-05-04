import { Lexer } from "./core/Lexer.js";

const source = 'if (3>=6) 6+6*2 || 2';
let lexer = new Lexer(source);

console.log(source, "\n", lexer.getTokens());


console.log("bye");