import { Token } from "../Token.js";
var Expresion = /** @class */ (function () {
    function Expresion(token, name, pos, length, mods, path) {
        this.token = token;
        this.name = name;
        this.pos = pos;
        this.length = length;
        this.mods = mods;
        this.ready = false;
        this.path = path;
    }
    return Expresion;
}());
export { Expresion };
var Modifier = /** @class */ (function () {
    function Modifier(mod, value) {
        this.mod = mod;
        this.value = value;
    }
    return Modifier;
}());
export { Modifier };
function db() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    console.log(".*.*.*.*.*.*.*.*.*");
    msg.forEach(function (x) {
        console.debug("..", x);
    });
    console.log("------------------");
}
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.version = "Interpreter V0.2";
        this.current = 0;
        this.brackets = 0;
        this.tokens = tokens;
    }
    Parser.prototype.error = function (token, message) {
        db("Error: ", message);
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        }
        else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    };
    Parser.prototype.parse = function () {
        var statements = [];
        while (!this.isAtEnd()) {
            var expr = this.expression();
            if (expr) {
                statements.push(expr);
            }
            else {
                this.advance();
            }
        }
        return statements; // [parse-error-handling]
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.current];
    };
    Parser.prototype.isAtEnd = function () {
        return this.peek().tok == Token.EOF;
    };
    Parser.prototype.isEOL = function () {
        return this.peek().tok == Token.EOL;
    };
    Parser.prototype.reset = function (position) {
        this.current = position;
    };
    Parser.prototype.getPosition = function () {
        return this.current;
    };
    Parser.prototype.advance = function () {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    };
    Parser.prototype.previous = function () {
        return this.tokens[this.current - 1];
    };
    Parser.prototype.consume = function (type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    };
    Parser.prototype.check = function (TokenType) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().tok == TokenType;
    };
    Parser.prototype.match = function () {
        var TokenType = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            TokenType[_i] = arguments[_i];
        }
        for (var _a = 0, TokenType_1 = TokenType; _a < TokenType_1.length; _a++) {
            var type = TokenType_1[_a];
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    };
    Parser.prototype.expression = function () {
        var token = "";
        var name = "";
        var invalid;
        var pos = null;
        var length = null;
        var mods = null;
        var path = [];
        if (this.match(Token.LBRACE)) {
            pos = this.previous().pos;
            console.log(this.peek());
            if (this.match(Token.AT, Token.DOLAR, Token.BIT_AND, Token.HASHTAG)) {
                console.log(this.peek());
                token = this.previous().value;
                do {
                    if (this.match(Token.IDENT, Token.INT)) {
                        console.log(this.peek());
                        name = this.previous().value;
                        path.push(name);
                    }
                } while (this.match(Token.DOT));
                if (this.match(Token.BIT_OR)) {
                    mods = this.modifiers();
                }
                if (this.match(Token.RBRACE)) {
                    length = this.previous().pos - pos + 1;
                    console.log("saliendo", this.peek());
                    return new Expresion(token, name, pos, length, mods, path);
                }
            }
        }
        //this.advance();
        return null;
    };
    Parser.prototype.modifiers = function () {
        var mods = [];
        while (true) {
            var mod = this.consume(Token.IDENT, "expected a identifier after expression '|'").value;
            var value = null;
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
    };
    return Parser;
}());
export { Parser };
//# sourceMappingURL=Parser.js.map