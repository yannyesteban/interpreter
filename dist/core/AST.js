import { Token } from "./Token.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
var AST = /** @class */ (function () {
    function AST(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    AST.prototype.error = function (token, message) {
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        }
        else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    };
    AST.prototype.parse = function () {
        var statements = [];
        while (!this.isAtEnd()) {
            /* Statements and State parse < Statements and State parse-declaration
                  statements.add(statement());
            */
            //> parse-declaration
            statements.push(this.declaration());
            //< parse-declaration
        }
        return statements; // [parse-error-handling]
    };
    AST.prototype.peek = function () {
        return this.tokens[this.current];
    };
    AST.prototype.isAtEnd = function () {
        return this.peek().tok == Token.EOF;
    };
    AST.prototype.advance = function () {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    };
    AST.prototype.previous = function () {
        return this.tokens[this.current - 1];
    };
    AST.prototype.consume = function (type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    };
    AST.prototype.check = function (TokenType) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().tok == TokenType;
    };
    AST.prototype.match = function (TokenType) {
        for (var _i = 0, TokenType_1 = TokenType; _i < TokenType_1.length; _i++) {
            var type = TokenType_1[_i];
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    };
    AST.prototype.expressionStatement = function () {
        var expr = this.expression();
        this.consume(Token.SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
    };
    AST.prototype.block = function () {
        var statements = [];
        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(Token.RBRACE, "Expect '}' after block.");
        return statements;
    };
    AST.prototype.statement = function () {
        //if (this.match([Token.FOR])) return this.forStatement();
        //if (this.match([Token.IF])) return this.ifStatement();
        //if (this.match([Token.PRINT])) return printStatement();
        //if (this.match([Token.RETURN])) return this.returnStatement();
        //if (this.match([Token.WHILE])) return this.whileStatement();
        if (this.match(Token.LBRACE))
            return new Stmt.Block(this.block());
        return this.expressionStatement();
    };
    AST.prototype.declaration = function () {
        try {
            //if (this.match([Token.CLASS])) return this.classDeclaration();
            //if (this.match([Token.FUNC])) return this._function("function");
            //if (this.match([Token.LET])) return this.varDeclaration();
            return this.statement();
        }
        catch ( /*ParseError*/error) {
            //this.synchronize();
            return null;
        }
    };
    AST.prototype.comparison = function () {
        var expr = this.term();
        while (this.match([Token.GTR, Token.GEQ, Token.LSS, Token.LEQ])) {
            var operator = this.previous();
            var right = this.term();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    AST.prototype.equality = function () {
        var expr = this.comparison();
        while (this.match([Token.NEQ, Token.EQL])) {
            var operator = this.previous();
            var right = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    AST.prototype.expression = function () {
        return this.equality();
    };
    AST.prototype.term = function () {
        var expr = this.factor();
        while (this.match([Token.SUB, Token.ADD])) {
            var operator = this.previous();
            var right = this.factor();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    AST.prototype.factor = function () {
        var expr = this.unary();
        while (this.match([Token.MUL, Token.DIV])) {
            var operator = this.previous();
            var right = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    AST.prototype.unary = function () {
        if (this.match([Token.SUB, Token.NOT])) {
            var operator = this.previous();
            var right = this.unary();
            return new Expr.Unary(operator, right);
        }
        return this.primary();
    };
    AST.prototype.primary = function () {
        if (this.match([Token.FALSE]))
            return new Expr.Literal(false);
        if (this.match([Token.TRUE]))
            return new Expr.Literal(true);
        if (this.match([Token.NULL]))
            return new Expr.Literal(null);
        if (this.match([Token.INT, Token.FLOAT, Token.STRING])) {
            return new Expr.Literal(this.previous().value);
        }
        if (this.match([Token.LPAREN])) {
            var expr = this.expression();
            this.consume(Token.RPAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }
    };
    return AST;
}());
export { AST };
//# sourceMappingURL=AST.js.map