import { Token } from "../Token.js";
import { Item } from "../Lexer.js";
import * as exp from "constants";

export class Expresion {
    public token: string;
    public name: string;
    
    public pos: number;
    public length: number;
    public mods: Modifier[];
    public ready: boolean;

    constructor(token: string, name: string, pos: number, length: number, mods: Modifier[]) {
        this.token = token;
        this.name = name;
    
        this.pos = pos;
        this.length = length;
        this.mods = mods;
        this.ready = false;
    }
}

export class Modifier {
    public mod: string;
    public value: string;

    constructor(mod: string, value: string) {
        this.mod = mod;
        this.value = value;
    }
}

function db(...msg) {
    console.log(".*.*.*.*.*.*.*.*.*")
    msg.forEach(x => {
        console.debug("..", x);
    });

    console.log("------------------")
}


export class Parser {

    public version = "Interpreter V0.2";

    public tokens: Item[];
    public current = 0;

    public brackets = 0;

    constructor(tokens) {
        this.tokens = tokens;
    }

    error(token, message) {
        db("Error: ", message);
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        } else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    }

    parse(): Expresion[] {
        let statements = [];
        while (!this.isAtEnd()) {
            const expr = this.expression();
            if (expr) {
                statements.push(expr);
            }
            else {
                this.advance();
            }
        }

        return statements; // [parse-error-handling]
    }

    peek() {
        return this.tokens[this.current];
    }

    isAtEnd() {
        return this.peek().tok == Token.EOF;
    }

    isEOL() {
        return this.peek().tok == Token.EOL;
    }

    reset(position) {
        this.current = position
    }

    getPosition() {
        return this.current;
    }

    advance() {

        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }



    previous() {
        return this.tokens[this.current - 1];
    }

    consume(type, message) {

        if (this.check(type)) {
            return this.advance();
        }

        throw this.error(this.peek(), message);
    }

    check(TokenType: Token) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().tok == TokenType;
    }

    match(...TokenType: Token[]) {
        for (let type of TokenType) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    expression() {
        let token: string = "";
        let name: string = "";
        let invalid: Item;
        let pos: number = null;
        let length: number = null;
        let mods: Modifier[] = null;

        if (this.match(Token.LBRACE)) {
            pos = this.previous().pos;
            console.log(this.peek())
            if (this.match(Token.AT, Token.DOLAR, Token.BIT_AND, Token.HASHTAG)) {
                console.log(this.peek())
                token = this.previous().value;

                if (this.match(Token.IDENT)) {
                    console.log(this.peek())
                    name = this.previous().value;
                }

                if (this.match(Token.BIT_OR)) {

                    mods = this.modifiers();
                }

                if (this.match(Token.RBRACE)) {
                    length = this.previous().pos - pos + 1;
                    console.log("saliendo", this.peek())
                    return new Expresion(token, name, pos, length, mods);
                }
            }
        }
        //this.advance();
        return null;

    }

    modifiers() {
        const mods: Modifier[] = [];

        while (true) {
            let mod = this.consume(Token.IDENT, "expected a identifier after expression '|'").value;
            let value = null;

            if (this.match(Token.COLON)) {
                console.log("PEEK ", this.peek());
                if (!this.match(Token.IDENT, Token.INT, Token.FLOAT)) {
                    throw this.error(this.peek(), "expected a identifier after expression ':'");
                }
                value = this.previous().value;

            }

            mods.push(new Modifier(mod, value));

            if (this.match(Token.BIT_OR)) {
                continue;
            }

            break;
        }

        return mods;
    }
}
