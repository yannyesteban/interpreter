import { Lexer } from "./Lexer.js";
import { Parser } from "./Parser.js";

import { Resolver } from "./Resolver.js";
import { Interpreter } from "./Interpreter.js";

export class Logic {

    private output: string = "";

    constructor() {

    }

    execute(source) {

        const lexer = new Lexer(source);
        const tokens = lexer.getTokens();
        const parser = new Parser(tokens);
        const statements = parser.parse();
        const interpreter = new Interpreter();
        const resolver = new Resolver(interpreter);
        const output = interpreter.interpret(statements);

        return output;

    }

    public scan(source) {

        this.output = source;

        const lexer = new Lexer(source);

        const setions = lexer.getSections("{:", ":}");

        const expressions = [];

        let delta = 0;
        let offset: number;
        for (let s of setions) {

            console.log(s)
            const parser = new Parser(s.tokens);
            const statements = parser.parse();
            const interpreter = new Interpreter();
            const resolver = new Resolver(interpreter);
            //resolver.resolve(statements);

            const output = interpreter.interpret(statements);

            s.output = output;
            s.pos += delta;
            offset = (s.outside && s.pos > 0) ? 1 : 0;
            this.output = this.output.substring(0, s.pos - offset) + output + this.output.substring(s.pos + s.length + offset);

            delta = delta + (output.length - s.length) + 2 * offset;
        }

        return this.output;
    }
}