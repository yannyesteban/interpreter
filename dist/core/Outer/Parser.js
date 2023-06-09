import { Token } from "../Token.js";
export var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["VAR"] = 1] = "VAR";
    ExpressionType[ExpressionType["DATE"] = 2] = "DATE";
    ExpressionType[ExpressionType["TIME"] = 3] = "TIME";
})(ExpressionType || (ExpressionType = {}));
export class Expression {
    constructor(token, name, pos, length, mods, path, type, outside) {
        this.token = token;
        this.name = name;
        this.pos = pos;
        this.length = length;
        this.mods = mods;
        this.ready = false;
        this.path = path;
        this.type = type;
        this.outside = outside;
    }
}
export class Modifier {
    constructor(mod, value) {
        this.mod = mod;
        this.value = value;
    }
}
function db(...msg) {
    console.log(".*.*.*.*.*.*.*.*.*");
    msg.forEach(x => {
        console.debug("..", x);
    });
    console.log("------------------");
}
export class Parser {
    constructor() {
        this.version = "Interpreter V0.2";
        this.current = 0;
        this.brackets = 0;
    }
    error(token, message) {
        db("Error: ", message);
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        }
        else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    }
    parse(tokens) {
        this.tokens = tokens;
        this.reset(0);
        return this.expression();
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
        this.current = position;
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
    check(TokenType) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().tok == TokenType;
    }
    match(...TokenType) {
        for (let type of TokenType) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    expression() {
        let token = "";
        let name = "";
        let invalid;
        let pos = null;
        let length = null;
        let mods = [];
        let path = [];
        let type = ExpressionType.VAR;
        let outside = false;
        if (this.match(Token.COLON)) {
            outside = true;
        }
        if (this.match(Token.AT, Token.DOLAR, Token.BIT_AND, Token.HASHTAG)) {
            token = this.previous().value;
            do {
                if (this.match(Token.IDENT, Token.INT, Token.STRING)) {
                    name = this.previous().value;
                    path.push(name);
                    if (name === "_DATE_") {
                        type = ExpressionType.DATE;
                    }
                    else if (name === "_TIME_") {
                        type = ExpressionType.TIME;
                    }
                }
            } while (this.match(Token.DOT));
            if (this.match(Token.BIT_OR)) {
                mods = this.modifiers();
            }
            return new Expression(token, name, pos, length, mods, path, type, outside);
        }
        return null;
    }
    modifiers() {
        const mods = [];
        while (true) {
            let mod = this.consume(Token.IDENT, "expected a identifier after expression '|'").value;
            let value = null;
            if (this.match(Token.COLON)) {
                if (!this.match(Token.IDENT, Token.INT, Token.FLOAT, Token.STRING)) {
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
//# sourceMappingURL=Parser.js.map