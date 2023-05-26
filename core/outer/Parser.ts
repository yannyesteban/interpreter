import { Token } from "../Token.js";
import { Item } from "../Lexer.js";
import * as exp from "constants";
export enum ExpressionType {
	VAR = 1, // main
	DATE,
	TIME
	

}
export class Expression {
    public token: string;
    public name: string;
    
    public pos: number;
    public length: number;
    public mods: Modifier[];
    public ready: boolean;

    public path:string[];
    public type: ExpressionType;

    constructor(token: string, name: string, pos: number, length: number, mods: Modifier[], path, type:ExpressionType) {
        this.token = token;
        this.name = name;
    
        this.pos = pos;
        this.length = length;
        this.mods = mods;
        this.ready = false;
        this.path = path;
        this.type = type;
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

    parse(): Expression[] {
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
        let mods: Modifier[] = [];
        let path = [];
        let type:ExpressionType = ExpressionType.VAR; 

        if (this.match(Token.LBRACE)) {
            pos = this.previous().pos;
            if (this.match(Token.AT, Token.DOLAR, Token.BIT_AND, Token.HASHTAG)) {
                
                token = this.previous().value;

                do{
                    if (this.match(Token.IDENT, Token.INT)) {
                        name = this.previous().value;
                        path.push(name);

                        if(name === "_DATE_"){
                            type = ExpressionType.DATE
                        }else if(name === "_TIME_"){
                            type = ExpressionType.TIME;
                        }
                    }
                }while(this.match(Token.DOT));

                if (this.match(Token.BIT_OR)) {
                    mods = this.modifiers();
                }

                if (this.match(Token.RBRACE)) {
                    length = this.previous().pos - pos + 1;
                    return new Expression(token, name, pos, length, mods, path, type);
                }
            }
        }
        return null;

    }

    modifiers() {
        const mods: Modifier[] = [];

        while (true) {
            let mod = this.consume(Token.IDENT, "expected a identifier after expression '|'").value;
            let value = null;

            if (this.match(Token.COLON)) {
                
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
