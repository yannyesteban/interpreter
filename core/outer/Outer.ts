import { Lexer } from "../Lexer.js";
import { Parser, Expression, Modifier, ExpressionType } from "./Parser.js";

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

    indexOf = 0;

    constructor() {
        this.data = [];
    }

    public setMap(token: string, data: object, pre: string) {
        this.data.push(new Data(token, data, pre));
    }

    public getDate(date: string | number | object | Date) {
        if (typeof date === "string") {
            let aux = date.split("-");
            return new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
        }

        if (date instanceof Date) {
            return date;
        }

    }

    public evalMods(data: string | number | object | Date, mods: Modifier[]) {

        let aux = {};
        mods.forEach(m => {

            switch (m.mod.toLowerCase()) {
                case "trim":
                    data = data.toString();
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
                    data = data.toString().toUpperCase();
                    break;
                case "lower":
                    data = data.toString().toLowerCase();
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
                case "digits": aux["format"] = true;
                    aux["locales"] = aux["locales"];
                    aux["digits"] = m.value || 2;
                    break;
                case "format": aux["format"] = true;
                    aux["locales"] = m.value;
                    if (aux["digits"] == undefined) {
                        aux["digits"] = 2;
                    }
                    break;
                case "date":
                    data = this.getDate(data).toLocaleDateString(m.value?.replace("_", "-"));
                    break;
                case "time":
                    data = this.getDate(data).toLocaleTimeString();
                    break;
                case "tofixed":
                    data = Number(data).toFixed(Number(m.value || 0));
                    break;
                case "pretty":
                    if (typeof data === "object") {
                        data = JSON.stringify(data, null, 2);
                    }
                    break;
            }
        });

        if (aux["format"]) {
            return new Intl.NumberFormat(aux["locales"]?.replace("_", "-"), {
                minimumFractionDigits: aux["digits"],
                maximumFractionDigits: aux["digits"]
            }).format(Number(data));
        }

        if (typeof data == "number") {
            return data.toString();
        }

        if (typeof data == "object") {
            return JSON.stringify(data)
        }

        return data;
    }


    public eval(expressions: Expression[]) {
        let delta = 0;
        for (let e of expressions) {

            let value = null;
            if (e.type === ExpressionType.VAR) {
                this.data.forEach(d => {
                    if (e.token == d.token) {
                        let data = d.data;
                        for (let i = 0; i < e.path.length; i++) {
                            if (data[e.path[i]] !== undefined) {
                                value = data[e.path[i]];
                                data = value;
                            } else {
                                return;
                            }
                        }
                    }
                });
            } else if (e.type === ExpressionType.DATE) {
                value = new Date();
            }

            if (value === null) {
                continue;
            }

            value = this.evalMods(value, e.mods);

            e.ready = true;
            e.pos += delta;

            this.output = this.output.substring(0, e.pos - 1) + value + this.output.substring(e.pos - 1 + e.length);

            delta = delta + (value.length - e.length);
        };

        return this.output;
    }

    public execute2(source) {

        this.output = source;

        let x = source.indexOf("{");
        let subToken = source.charAt(x + 1);
        const lexer = new Lexer(source, false);
        let tokens = [];
        if (subToken == "@" || subToken == "#" || subToken == "$" || subToken == "&") {
            tokens = lexer.getTokens();
        }







        const parser = new Parser(tokens);
        const expressions = parser.parse();

        return this.eval(expressions);
    }

    public execute(source) {

        this.output = source;

        const lexer = new Lexer(source, false);

        lexer.isLeftDelim = function () {
           
            while (!this.eof) {
                console.log("PeeK", this.peek());
                if(this.peek() == "{"){
                    console.log(" llave Open", this.peek());
                    this.next();
                    console.log(" ???", this.peek());
                    if(this.peek()=="@"){
                        this.next();
                        console.log("....", this.peek())
                        
                        return true;
                    }
                }
                this.next();
                
            }
            return false;
        }

        lexer.isRightDelim = function () {
            console.log("PeeK22", this.peek());

            if (this.peek() == "}") {
                
                return true;

            }
            return false;
        }
        const tokens = lexer.getTokens2();


        return;


        const parser = new Parser(tokens);
        const expressions = parser.parse();

        return this.eval(expressions);
    }
}
