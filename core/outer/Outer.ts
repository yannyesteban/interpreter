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

    constructor() {
        this.resetData();
    }

    public resetData() {
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
        if (data === null || data === undefined) {
            const defMod = mods.find((m) => m.mod == "def");
            if (defMod) {
                if (defMod.value) {
                    data = defMod.value;
                } else {
                    data = "";
                }
            } else {
                return data;
            }
        }

        let aux = {};
        mods.forEach((m) => {
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
                case "digits":
                    aux["format"] = true;
                    aux["locales"] = aux["locales"];
                    aux["digits"] = m.value || 2;
                    break;
                case "format":
                    aux["format"] = true;
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
                maximumFractionDigits: aux["digits"],
            }).format(Number(data));
        }

        if (typeof data == "number") {
            return data.toString();
        }

        if (typeof data == "object") {
            if (data instanceof Date) {
                return data.toISOString();
            }
            return JSON.stringify(data);
        }

        return data;
    }

    public eval(expressions: Expression[]) {
        let delta = 0;
        let offset;
        for (let e of expressions) {
            let value = null;
            if (e.type === ExpressionType.VAR) {
                this.data.forEach((d) => {
                    if (e.token == d.token) {
                        const path = [...e.path];
                        const name = path.pop();
                        let data = d.data;

                        for (let i = 0; i < path.length; i++) {
                            if (data[path[i]] !== undefined) {
                                data = data[path[i]];
                            } else {
                                return;
                            }
                        }

                        value = data[name];
                    }
                });
            } else if (e.type === ExpressionType.DATE) {
                value = new Date();
            }

            value = this.evalMods(value, e.mods);

            if (value === null || value === undefined) {
                continue;
            }

            e.ready = true;
            e.pos += delta;
            offset = e.outside && e.pos > 0 ? 1 : 0;
            this.output =
                this.output.substring(0, e.pos - offset) + value + this.output.substring(e.pos + e.length + offset);

            delta = delta + (value.length - e.length) + 2 * offset;
        }

        return this.output;
    }

    public execute(source) {
        this.output = source;

        const lexer = new Lexer(source, false);

        const setions = lexer.getSections("{{", "}}");

        const parser = new Parser();

        const expressions = [];

        for (let s of setions) {
            let expr = parser.parse(s.tokens);

            if (expr) {
                expr.length = s.length;
                expr.pos = s.pos;
                expr.outside = s.outside && expr.outside;
                expressions.push(expr);
            }
        }

        //console.log(expressions)

        return this.eval(expressions);
    }
}
