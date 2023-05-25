import { Lexer } from "../Lexer.js";
import { Parser, Expresion, Modifier } from "./Parser.js";

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

    public evalMods(data: string, mods: Modifier[]) {

        mods.forEach(m => {

            switch (m.mod.toLowerCase()) {
                case "trim":
                    if (m.value) {
                        if (m.value.toLowerCase() == "left") {
                            data = data.trimStart();
                        } else if (m.value.toLowerCase() == "right") {
                            data = data.trimEnd();
                        }
                    } else {
                        data = data.trim();
                    }

                    break;
                case "upper":
                    data = data.toUpperCase();
                    break;
                case "upper":
                    data = data.toUpperCase();
                    break;
                case "lower":
                    data = data.toLowerCase();
                    break;
                case "floor":
                    data = Math.floor(Number(data)).toString();
                    break;
                case "ceil":
                    data = Math.ceil(Number(data)).toString();
                    break;
                case "abs":
                    data = Math.abs(Number(data)).toString();
                    break;
                case "tofixed":
                    data = Number(data).toFixed(Number(m.value || 0));
                    break;
            }
        });

        return data;
    }

    public eval(expressions: Expresion[]) {
        let delta = 0;
        expressions.forEach(e => {
            this.data.forEach(d => {
                if (e.token == d.token) {
                    let data;
                    if (d.data[e.name]) {

                        data = d.data[e.name];

                        if (typeof data == "number") {
                            data = data.toString();
                        }
                        if (e.mods) {
                            data = this.evalMods(d.data[e.name], e.mods);
                        }

                    } else {
                        return;
                    }

                    e.ready = true;
                    e.pos += delta;
                    this.output = this.output.substring(0, e.pos - 1) + data + this.output.substring(e.pos - 1 + e.length);

                    delta = delta + (data.length - e.length);

                    console.log(" pos : ", delta, e.pos);
                }
            });
        });

        console.log("expressions\n", expressions)
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