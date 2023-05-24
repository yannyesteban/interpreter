import { Lexer } from "../Lexer.js";
import { Parser, Expresion } from "./Parser.js";

class Data {
    public token: string;
    public data: object;
    public pre: string;

    constructor(token: string, data: object, pre: string) {
        this.token = token;
        this.data = data;
        this.pre = pre;
    }
}

export class Outer {

    public source: string;
    public output: string;
    private data: Data[];
    constructor(source) {
        this.source = source;
        this.output = source;
        this.data = [];

    }


    public setMap(token: string, data: object, pre: string) {
        this.data.push(new Data(token, data, pre));


    }


    public interprete(source: string) {


    }

    public eval(expressions: Expresion[]) {
        let delta = 0;
        expressions.forEach(e => {


            //console.log(e)
           
            this.data.forEach(d => {
                if (e.token == d.token) {
                    if (d.data[e.name]) {
                        //console.log(d.data[e.name])

                        e.pos += delta;
                        this.output = this.output.substring(0, e.pos - 1) + d.data[e.name] + this.output.substring(e.pos - 1 + e.length);

                        delta = delta + (d.data[e.name].length - e.length );

                        //console.log(delta, this.source);
                    }
                }

            });
        });

        return this.output;

    }

    public run() {

        console.log("data\n", this.data)

        console.log("source:\n", this.source);
        const lexer = new Lexer(this.source, false);

        const tokens = lexer.getTokens();
        console.log(tokens);

        const parser = new Parser(tokens);
        const expressions = parser.parse();
        console.log("...", expressions)

        return this.eval(expressions);
        
    }
}