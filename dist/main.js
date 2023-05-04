import { Lexer } from "./core/Lexer.js";
var source = 'if (3>=6) 6+6*2 || 2';
var lexer = new Lexer(source);
console.log(source, "\n", lexer.getTokens());
console.log("bye");
//# sourceMappingURL=main.js.map