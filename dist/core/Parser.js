import { Token } from "./Token.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
function db() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    console.log("------------------");
    msg.forEach(function (x) {
        console.debug("..", x);
    });
    console.log("------------------");
}
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.version = "Interpreter V0.1";
        this.current = 0;
        this.brackets = 0;
        this.tokens = tokens;
        db(tokens);
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
            statements.push(this.declaration());
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
    Parser.prototype.expressionStatement = function () {
        if (this.match(Token.EOL)) {
            return null;
        }
        var expr = this.expression();
        if (this.brackets > 0 && this.peek().tok == Token.RBRACE) {
        }
        else {
            if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
                console.log("what ", this.peek(), Token.EOF);
                this.consume(Token.SEMICOLON, "1.0 Expect ';' after expression..");
            }
        }
        return new Stmt.Expression(expr);
    };
    Parser.prototype.block = function () {
        var statements /*: Expr.Expression[]*/ = [];
        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(Token.RBRACE, "Expect '}' after block.");
        this.brackets--;
        return statements;
    };
    Parser.prototype.statement = function () {
        if (this.match(Token.FOR))
            return this.forStatement();
        if (this.match(Token.IF)) {
            return this.ifStatement();
        }
        if (this.match(Token.PRINT))
            return this.printStatement();
        if (this.match(Token.RETURN))
            return this.returnStatement();
        if (this.match(Token.DO))
            return this.doStatement();
        if (this.match(Token.WHILE))
            return this.whileStatement();
        if (this.match(Token.LBRACE)) {
            this.brackets++;
            var position = this.getPosition();
            try {
                var expr = new Expr.Object(this.objectValue(true));
                //this.consume(Token.SEMICOLON, "Expect ';' after expression.");
                if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
                    this.consume(Token.SEMICOLON, "Expect ';' after expression..");
                }
                return new Stmt.Expression(expr);
            }
            catch (e) {
                db("UN ERROR PASó");
            }
            this.reset(position);
            return new Stmt.Block(this.block());
        }
        return this.expressionStatement();
    };
    Parser.prototype.declaration = function () {
        try {
            //if (this.match(Token.CLASS)) return this.classDeclaration();
            //if (this.match(Token.FUNC)) return this._function("function");
            if (this.match(Token.LET)) {
                return this.varDeclaration();
            }
            return this.statement();
        }
        catch ( /*ParseError*/error) {
            db("Error: ? ", error);
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
        var expr = this.assignment();
        if (this.match(Token.QUESTION)) {
            var exprThen = this.assignment();
            this.consume(Token.COLON, "Expect ':' after expression.");
            var exprElse = this.assignment();
            expr = new Expr.Ternary(expr, exprThen, exprElse);
        }
        return expr;
        //return this.assignment();
    };
    Parser.prototype.assignment = function () {
        /* Statements and State parse-assignment < Control Flow or-in-assignment
            Expr expr = equality();
        */
        //> Control Flow or-in-assignment
        var expr = this.or();
        //< Control Flow or-in-assignment
        if (this.match(Token.ASSIGN, Token.ADD_ASSIGN, Token.SUB_ASSIGN, Token.MUL_ASSIGN, Token.DIV_ASSIGN, Token.MOD_ASSIGN)) {
            var equals = this.previous();
            var value = this.assignment();
            if (expr instanceof Expr.Variable) {
                var name_1 = expr.name;
                return new Expr.Assign(name_1, value, equals);
                //> Classes assign-set
            }
            else if (expr instanceof Expr.Get) {
                var get = expr;
                return new Expr.Set(get.object, get.name, value, equals);
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
        var expr = this.power();
        while (this.match(Token.MUL, Token.DIV, Token.MOD)) {
            var operator = this.previous();
            var right = this.power();
            expr = new Expr.Binary(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.power = function () {
        var expr = this.unary();
        while (this.match(Token.POW)) {
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
        return this.call();
    };
    Parser.prototype.finishCall = function (callee) {
        var arg = [];
        if (!this.check(Token.RPAREN)) {
            do {
                if (arg.length >= 64) {
                    this.error(this.peek(), "Can't have more than 255 arguments.");
                }
                arg.push(this.expression());
            } while (this.match(Token.COMMA));
        }
        var paren = this.consume(Token.RPAREN, "Expect ')' after arguments.");
        return new Expr.Call(callee, paren, arg);
    };
    Parser.prototype.call = function () {
        var expr = this.primary();
        while (true) {
            if (this.match(Token.LPAREN)) {
                expr = this.finishCall(expr);
            }
            else if (this.match(Token.DOT)) {
                var name_2 = this.consume(Token.IDENT, "Expect property name after '.'.");
                expr = new Expr.Get(expr, name_2);
            }
            else if (this.match(Token.LBRACK)) {
                var name_3 = this.expression();
                expr = new Expr.Get2(expr, name_3);
                this.consume(Token.RBRACK, "Expect ']' after property name.");
            }
            else {
                break;
            }
        }
        return expr;
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
            return new Expr.Literal(this.previous().value);
        }
        if (this.match(Token.LBRACE)) {
            return new Expr.Object(this.objectValue());
        }
        if (this.match(Token.LBRACK)) {
            return new Expr.Array(this.arrayValue());
        }
        if (this.match(Token.INCR, Token.DECR)) {
            console.log("post ASign");
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
        if (this.match(Token.IDENT)) {
            var ident = this.previous();
            if (this.match(Token.INCR, Token.DECR)) {
                console.log("pre ASIGN 2");
                var op = this.previous();
                return new Expr.PostAssign(ident, op);
            }
            return new Expr.Variable(this.previous());
        }
        if (this.match(Token.IDENT)) {
            return new Expr.Variable(this.previous());
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
        //this.consume(Token.SEMICOLON, "Expect ';' after variable declaration.");
        if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
            this.consume(Token.SEMICOLON, "Expect ';' after expression..");
        }
        return new Stmt.Var(name, initializer);
    };
    Parser.prototype.arrayValue = function () {
        var values = [];
        if (this.match(Token.RBRACK)) {
            return values;
        }
        do {
            values.push(this.or());
        } while (this.match(Token.COMMA));
        this.consume(Token.RBRACK, "Expect ']'.");
        return values;
    };
    Parser.prototype.objectValue = function (ambiguity) {
        var pairs = [];
        if (this.match(Token.RBRACK)) {
            if (ambiguity) {
                this.error(this.peek(), "error of ambiguity");
            }
            return pairs;
        }
        do {
            var name_4 = null;
            var value = null;
            if (this.peek().tok == Token.IDENT || this.peek().tok == Token.STRING || this.peek().tok == Token.INT) {
                name_4 = new Expr.Literal(this.peek().value);
                this.advance();
            }
            else if (this.match(Token.LBRACK)) {
                name_4 = this.or();
                this.consume(Token.RBRACK, "Expect ']' after property id");
            }
            this.consume(Token.COLON, "Expect ':'.");
            value = this.or();
            pairs.push({
                name: name_4,
                value: value
            });
        } while (this.match(Token.COMMA));
        this.consume(Token.RBRACE, "Expect '}'.");
        return pairs;
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
    Parser.prototype.doStatement = function () {
        var body = this.statement();
        this.consume(Token.WHILE, "Expect 'while' token after statement.");
        this.consume(Token.LPAREN, "Expect '(' after 'if'.");
        var condition = this.expression();
        this.consume(Token.RPAREN, "Expect ')' after if condition.");
        return new Stmt.Do(condition, body);
    };
    Parser.prototype.whileStatement = function () {
        this.consume(Token.LPAREN, "Expect '(' after 'while'.");
        var condition = this.expression();
        this.consume(Token.RPAREN, "Expect ')' after condition.");
        var body = this.statement();
        return new Stmt.While(condition, body);
    };
    Parser.prototype.returnStatement = function () {
        //Token keyword: I = previous();
        var value = null;
        if (!this.check(Token.SEMICOLON)) {
            value = this.expression();
        }
        if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
            this.consume(Token.SEMICOLON, "Expect ';' after expression..");
        }
        //this.consume(Token.SEMICOLON, "Expect ';' after return value.");
        return new Stmt.Return(value);
    };
    Parser.prototype.forStatement = function () {
        this.consume(Token.LPAREN, "Expect '(' after 'for'.");
        var initializer;
        if (this.match(Token.SEMICOLON)) {
            initializer = null;
        }
        else if (this.match(Token.LET)) {
            initializer = this.varDeclaration();
        }
        else {
            initializer = this.expressionStatement();
        }
        var condition = null;
        if (!this.check(Token.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(Token.SEMICOLON, "Expect ';' after loop condition.");
        var increment = null;
        if (!this.check(Token.RPAREN)) {
            increment = this.expression();
        }
        this.consume(Token.RPAREN, "Expect ')' after for clauses.");
        var body = this.statement();
        // for-desugar-increment
        if (increment != null) {
            body = new Stmt.Block([
                body,
                new Stmt.Expression(increment)
            ]);
        }
        if (condition == null)
            condition = new Expr.Literal(true);
        body = new Stmt.While(condition, body);
        if (initializer != null) {
            body = new Stmt.Block([initializer, body]);
        }
        return body;
    };
    Parser.prototype.printStatement = function () {
        var value = this.expression();
        this.consume(Token.SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value);
    };
    return Parser;
}());
export { Parser };
//# sourceMappingURL=Parser.js.map