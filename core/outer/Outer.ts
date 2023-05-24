import { Lexer } from "../Lexer.js";
import { Parser } from "./Parser.js";

class Data {
    public token: string;
    public data: string;
    public pre: string;

    constructor(token: string, data: string, pre: string) {
        this.token = token;
        this.data = data;
        this.pre = pre;
    }
}

export class Outer {

    public source: string;
    constructor(source) {
        this.source = source;

    }


    public setMap(pre: string, data: object) {
        

    }


    public interprete(source: string) {


    }

    public run() {

        console.log("source:\n", this.source);
        const lexer = new Lexer(this.source);

        const tokens = lexer.getTokens();
        console.log(tokens);

        const parser = new Parser(tokens);

        console.log(parser.parse())

        return "RUN.";
    }
}