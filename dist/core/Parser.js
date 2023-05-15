import { Token } from "./Token.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    Parser.prototype.error = function (token, message) {
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
            /* Statements and State parse < Statements and State parse-declaration
                  statements.add(statement());
            */
            //> parse-declaration
            statements.push(this.declaration());
            //< parse-declaration
        }
        return statements; // [parse-error-handling]
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.current];
    };
    Parser.prototype.isAtEnd = function () {
        return this.peek().tok == Token.EOF;
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
    Parser.prototype.expressionStatement = function () {
        var expr = this.expression();
        this.consume(Token.SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
    };
    Parser.prototype.block = function () {
        var statements /*: Expr.Expression[]*/ = [];
        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(Token.RBRACE, "Expect '}' after block.");
        return statements;
    };
    Parser.prototype.statement = function () {
        //if (this.match(Token.FOR)) return this.forStatement();
        if (this.match(Token.IF)) {
            return this.ifStatement();
        }
        //if (this.match(Token.PRINT)) return printStatement();
        //if (this.match(Token.RETURN)) return this.returnStatement();
        //if (this.match(Token.WHILE)) return this.whileStatement();
        if (this.peek().tok == Token.LBRACE) {
            return this.expressionObj();
        }
        if (this.match(Token.LBRACE)) {
            return new Stmt.Block(this.block());
        }
        return this.expressionStatement();
    };
    Parser.prototype.declaration = function () {
        console.log("declaration");
        try {
            //if (this.match(Token.CLASS)) return this.classDeclaration();
            //if (this.match(Token.FUNC)) return this._function("function");
            console.log("mi token 46----->", this.peek());
            if (this.match(Token.LET)) {
                console.log("mi token 46");
                return this.varDeclaration();
            }
            return this.statement();
        }
        catch ( /*ParseError*/error) {
            console.log(error);
            throw error;
            //this.synchronize();
            return null;
        }
        return null;
    };
    Parser.prototype.comparison = function () {
        var expr = this.term();
        while (this.match(Token.GTR, Token.GEQ, Token.LSS, Token.LEQ)) {
            var operator = this.previous();
            var right = this.term();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.equality = function () {
        var expr = this.comparison();
        while (this.match(Token.NEQ, Token.EQL)) {
            var operator = this.previous();
            var right = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.expression = function () {
        //return this.equality();
        return this.assignment();
    };
    Parser.prototype.assignment = function () {
        /* Statements and State parse-assignment < Control Flow or-in-assignment
            Expr expr = equality();
        */
        //> Control Flow or-in-assignment
        var expr = this.or();
        //< Control Flow or-in-assignment
        if (this.match(Token.EQL)) {
            var equals = this.previous();
            var value = this.assignment();
            if (expr instanceof Expr.Variable) {
                var name_1 = expr.name;
                return new Expr.Assign(name_1, value);
                //> Classes assign-set
            }
            else if (expr instanceof Expr.Get) {
                var get = expr;
                return new Expr.Set(get.object, get.name, value);
                //< Classes assign-set
            }
            this.error(equals, "Invalid assignment target."); // [no-throw]
        }
        return expr;
    };
    Parser.prototype.or = function () {
        var expr = this.and();
        while (this.match(Token.OR)) {
            var operator = this.previous();
            var right = this.and();
            expr = new Expr.Logical(expr, operator, right);
        }
        return expr;
    };
    //< Control Flow or
    //> Control Flow and
    Parser.prototype.and = function () {
        var expr = this.equality();
        while (this.match(Token.AND)) {
            var operator = this.previous();
            var right = this.equality();
            expr = new Expr.Logical(expr, operator, right);
        }
        return expr;
    };
    //< Control Flow and
    //> comparison
    Parser.prototype.term = function () {
        var expr = this.factor();
        while (this.match(Token.SUB, Token.ADD)) {
            var operator = this.previous();
            var right = this.factor();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.factor = function () {
        var expr = this.unary();
        while (this.match(Token.MUL, Token.DIV)) {
            var operator = this.previous();
            var right = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.unary = function () {
        if (this.match(Token.SUB, Token.NOT)) {
            var operator = this.previous();
            var right = this.unary();
            return new Expr.Unary(operator, right);
        }
        return this.primary();
    };
    Parser.prototype.primary = function () {
        if (this.match(Token.FALSE)) {
            return new Expr.Literal(false);
        }
        if (this.match(Token.TRUE)) {
            return new Expr.Literal(true);
        }
        if (this.match(Token.NULL)) {
            return new Expr.Literal(null);
        }
        if (this.match(Token.INT, Token.FLOAT, Token.STRING)) {
            console.log("number or string.............");
            return new Expr.Literal(this.previous().value);
        }
        if (this.match(Token.INCR, Token.DECR)) {
            console.log("post ASIGn");
            var id = null;
            var op = this.previous();
            if (this.match(Token.IDENT)) {
                console.log("post ASIGN 2");
                id = this.previous();
                return new Expr.PostAssign(id, op);
            }
            console.log("post ASIGN 5");
            throw new Error("expected a identifier");
        }
        if (this.match(Token.LPAREN)) {
            var expr = this.expression();
            this.consume(Token.RPAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }
    };
    Parser.prototype.ifStatement = function () {
        this.consume(Token.LPAREN, "Expect '(' after 'if'.");
        var condition = this.expression();
        this.consume(Token.RPAREN, "Expect ')' after if condition."); // [parens]
        var thenBranch = this.statement();
        var elseBranch = null;
        if (this.match(Token.ELSE)) {
            elseBranch = this.statement();
        }
        return new Stmt.If(condition, thenBranch, elseBranch);
    };
    Parser.prototype.varDeclaration = function () {
        var name = this.consume(Token.IDENT, "Expect variable name.");
        var initializer = null;
        if (this.match(Token.ASSIGN)) {
            initializer = this.expression();
        }
        this.consume(Token.SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    };
    Parser.prototype.expressionObj = function () {
        console.log("Peek: ", this.peek());
        if (this.match(Token.LBRACE)) {
            var x = this.peek();
            console.log("Peek 2: ", x);
        }
        throw "error";
        return new Expr.Object(null);
    };
    Parser.prototype.isObjectId = function () {
        if (this.peek().tok == Token.IDENT || this.peek().tok == Token.STRING || this.peek().tok == Token.INT) {
            return {
                name: this.peek().value,
                type: this.peek().tok
            };
        }
    };
    Parser.prototype.nameObjectId = function () {
        if (this.peek().tok == Token.LBRACK) {
        }
    };
    return Parser;
}());
export { Parser };
//# sourceMappingURL=Parser.js.map