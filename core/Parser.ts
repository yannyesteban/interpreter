import { Token } from "./Token.js";
import { Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";


function db(...msg) {
    console.log("------------------")
    msg.forEach(x => {
        console.trace("..", x);
    });

    console.log("------------------")
}

type exp = any;
export class Parser {

    public version = "Interpreter V0.2";

    public tokens: Item[];
    public current = 0;

    public brackets = 0;

    constructor(tokens) {
        this.tokens = tokens;
        db(tokens)
    }


    error(token, message) {
        db("Error: ", token, message);
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        } else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    }
    parse(): Stmt.Statement[] {
        let statements = [];
        while (!this.isAtEnd()) {
            let s;
            statements.push(s = this.declaration());
            console.log(s)
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

    nextValid() {
        while (this.peek().tok === Token.EOL) {
            this.advance();
        }

        return;
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

    private expressionStatement() {

        if (this.match(Token.EOL)) {
            return null;
        }
        let expr = this.expression();
        if (!expr) {

            this.error(this.peek(), "unknow error!")
            this.advance()
        }

        let mods: Stmt.Modifier[] = [];

        if (this.match(Token.BIT_OR)) {

            mods = this.modifiers();
        }

        if (this.brackets > 0 && this.peek().tok == Token.RBRACE) {

        } else {
            if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {

                this.consume(Token.SEMICOLON, "1.0 Expect ';' after expression..");
            }

        }



        return new Stmt.Expression(expr, mods, this.peek().pos);
    }

    modifiers() {
        const mods: Stmt.Modifier[] = [];

        while (true) {

            let mod = this.consume(Token.IDENT, "expected a identifier after expression '|'").value;
            let value = null;

            if (this.match(Token.COLON)) {

                if (this.match(Token.AT)) {
                    let id = this.consume(Token.IDENT, "expected a literal value after expression '@'");
                    value = new Expr.Literal(id.value, Token.STRING);
                } else {
                    value = this.expression();
                }
            }

            mods.push(new Stmt.Modifier(mod, value));

            if (this.match(Token.BIT_OR)) {
                continue;
            }

            break;
        }

        return mods;
    }

    private block() {
        let statements/*: Expr.Expression[]*/ = [];

        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(Token.RBRACE, "Expect '}' after block.");
        this.brackets--;
        return statements;
    }

    private statement() {


        if (this.match(Token.FOR)) {
            return this.forStatement();
        }


        if (this.match(Token.IF)) {
            return this.ifStatement();
        }

        if (this.match(Token.PRINT)) {
            return this.printStatement();
        }

        if (this.match(Token.RETURN)) {
            return this.returnStatement();
        }


        if (this.match(Token.DO)) {
            return this.doStatement();
        }
        if (this.match(Token.WHILE)) {
            return this.whileStatement();
        }
        if (this.match(Token.LBRACE)) {
            this.brackets++;
            const position = this.getPosition();
            try {

                let expr = new Expr.Object(this.objectValue(true), this.peek().pos);
                //this.consume(Token.SEMICOLON, "Expect ';' after expression.");
                if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
                    this.consume(Token.SEMICOLON, "Expect ';' after expression..");
                }

                return new Stmt.Expression(expr, [], this.peek().pos);

            } catch (e) {
                db("UN ERROR PASó")
            }
            this.reset(position);

            return new Stmt.Block(this.block(), this.peek().pos);
        }

        return this.expressionStatement();
    }

    declaration() {
        try {

            if (this.match(Token.CLASS)) {
                return this.classDeclaration();
            }
            if (this.match(Token.FUNC)) {
                return this._function("function");
            }

            if (this.match(Token.LET)) {
                return this.varDeclaration();
            }

            const position = this.getPosition();
            if (this.match(Token.IDENT)) {
                const name = this.previous();

                if (this.match(Token.LET)) {
                    const initializer = this.expression();
                    //this.consume(Token.SEMICOLON, "Expect ';' after variable declaration.");
                    if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
                        this.consume(Token.SEMICOLON, "Expect ';' after expression..");
                    }

                    return new Stmt.Var(name, initializer, this.peek().pos)
                }

                this.reset(position);
            }


            return this.statement();
        } catch (/*ParseError*/ error) {
            db("Error: ? ", error)
            throw error;
            //this.synchronize();
            return null;
        }
        return null;
    }


    classDeclaration() {
        const name:Item = this.consume(Token.IDENT, "Expect class name.");
    //> Inheritance parse-superclass
    
        let superclass: Expr.Variable = null;
        if (this.match(Token.LSS)) {
          this.consume(Token.IDENT, "Expect superclass name.");
          superclass = new Expr.Variable(this.previous(), this.peek().pos);
        }
    
    //< Inheritance parse-superclass
        this.consume(Token.LBRACE, "Expect '{' before class body.");
    
        const methods:Stmt.Function[] = [];
        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
          methods.push(this._function("method"));
        }
    
        this.consume(Token.RBRACE, "Expect '}' after class body.");
    
    /* Classes parse-class-declaration < Inheritance construct-class-ast
        return new Stmt.Class(name, methods);
    */
    //> Inheritance construct-class-ast
        return new Stmt.Class(name, superclass, methods, this.peek().pos);
    //< Inheritance construct-class-ast
      }


    comparison() {
        let expr: exp = this.term();

        while (this.match(Token.GTR, Token.GEQ, Token.LSS, Token.LEQ)) {
            let operator = this.previous();
            let right: exp = this.term();
            expr = new Expr.Binary(expr, operator, right, this.peek().pos);
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (this.match(Token.NEQ, Token.EQL)) {
            let operator: Item = this.previous();
            let right: exp = this.comparison();
            expr = new Expr.Binary(expr, operator, right, this.peek().pos);
        }

        return expr;
    }

    expression() {

        let expr = this.assignment();
        let pos = this.peek().pos;
        if (this.match(Token.QUESTION)) {


            let exprThen = this.assignment();
            this.consume(Token.COLON, "Expect ':' after expression.");

            let exprElse = this.assignment();
            expr = new Expr.Ternary(expr, exprThen, exprElse, pos);
        }

        return expr;
        //return this.assignment();
    }

    assignment() {
        /* Statements and State parse-assignment < Control Flow or-in-assignment
            Expr expr = equality();
        */
        //> Control Flow or-in-assignment
        let expr: Expr.Expression = this.or();
        //< Control Flow or-in-assignment



        if (this.match(Token.ASSIGN, Token.ADD_ASSIGN, Token.SUB_ASSIGN, Token.MUL_ASSIGN, Token.DIV_ASSIGN, Token.MOD_ASSIGN)) {
            const equals: Item = this.previous();
            let value: Expr.Expression = this.assignment();

            if (expr instanceof Expr.Variable) {
                const name: Item = expr.name;
                return new Expr.Assign(name, value, equals, this.peek().pos);
                //> Classes assign-set
            } else if (expr instanceof Expr.Get) {
                const get: Expr.Get = expr;
                return new Expr.Set(get.object, get.name, value, equals, this.peek().pos);
                //< Classes assign-set
            } /*else if (expr instanceof Expr.Get2) {
                const get: Expr.Get2 = expr;
                return new Expr.Set2(get.object, get.name, value, equals, this.peek().pos);
                //< Classes assign-set
            }*/

            this.error(equals, "Invalid assignment target."); // [no-throw]
        }

        return expr;
    }
    or(): Expr.Expression {
        let expr: Expr.Expression = this.and();

        while (this.match(Token.OR)) {
            const operator: Item = this.previous();
            const right: Expr.Expression = this.and();
            expr = new Expr.Logical(expr, operator, right, this.peek().pos);
        }

        return expr;
    }
    //< Control Flow or
    //> Control Flow and
    and(): Expr.Expression {
        let expr: Expr.Expression = this.equality();

        while (this.match(Token.AND)) {
            const operator: Item = this.previous();
            const right: Expr.Expression = this.equality();
            expr = new Expr.Logical(expr, operator, right, this.peek().pos);
        }

        return expr;
    }
    //< Control Flow and

    //> comparison

    term() {
        let expr: exp = this.factor();

        while (this.match(Token.SUB, Token.ADD)) {
            let operator = this.previous();
            let right: exp = this.factor();
            expr = new Expr.Binary(expr, operator, right, this.peek().pos);
        }

        return expr;
    }

    factor() {

        let expr: exp = this.power();

        while (this.match(Token.MUL, Token.DIV, Token.MOD)) {
            let operator = this.previous();
            let right = this.power();
            expr = new Expr.Binary(expr, operator, right, this.peek().pos);
        }

        return expr;
    }

    power() {
        let expr: exp = this.unary();

        while (this.match(Token.POW)) {
            let operator = this.previous();
            let right = this.power();
            expr = new Expr.Binary(expr, operator, right, this.peek().pos);
        }
        return expr;
    }

    unary() {



        if (this.match(Token.SUB, Token.NOT)) {
            let operator = this.previous();
            let right = this.unary();
            return new Expr.Unary(operator, right, this.peek().pos);
        }


        if (this.match(Token.INCR, Token.DECR)) {


            let op = this.previous();


            let id = this.call();
            return new Expr.PreAssign(id, op, this.peek().pos)



            //throw new Error("expected a identifier");

        }

        return this.call();
    }

    finishCall(callee: Expr.Expression): Expr.Expression {
        let pos = this.peek().pos;
        const arg: Expr.Expression[] = [];
        if (!this.check(Token.RPAREN)) {
            do {

                if (arg.length >= 64) {
                    this.error(this.peek(), "Can't have more than 255 arguments.");
                }

                arg.push(this.expression());
            } while (this.match(Token.COMMA));
        }

        const paren: Item = this.consume(Token.RPAREN, "Expect ')' after arguments.");

        return new Expr.Call(callee, paren, arg, pos);
    }


    call(): Expr.Expression {
        let expr: Expr.Expression = this.primary();

        while (true) {
            if (this.match(Token.LPAREN)) {
                expr = this.finishCall(expr);

            } else if (this.match(Token.DOT)) {
                const name: Item = this.consume(Token.IDENT, "Expect property name after '.'.");
                expr = new Expr.Get(expr, new Expr.Literal(name.value), this.peek().pos);
            } else if (this.match(Token.LBRACK)) {
                const name: Expr.Expression = this.expression();
                expr = new Expr.Get(expr, name, this.peek().pos);
                this.consume(Token.RBRACK, "Expect ']' after property name.");
            } else {
                break;
            }
        }

        if (this.match(Token.INCR, Token.DECR)) {
            const op = this.previous();
            //return new Expr.PostAssign(ident, op, this.peek().pos);
            expr = new Expr.PostAssign(expr, op, this.peek().pos);
        }
        return expr;
    }

    primary() {


        if (this.match(Token.FALSE)) {
            return new Expr.Literal(false, this.peek().pos);
        }
        if (this.match(Token.TRUE)) {
            return new Expr.Literal(true, this.peek().pos);
        }
        if (this.match(Token.NULL)) {
            return new Expr.Literal(null, this.peek().pos);
        }


        if (this.match(Token.INT, Token.FLOAT, Token.STRING)) {

            return new Expr.Literal(this.previous().value, this.peek().pos, this.previous().tok);
        }





        if (this.match(Token.LBRACK)) {

            return new Expr.Array(this.arrayValue(), this.peek().pos);
        }




        /*
        if (this.match(Token.IDENT)) {
            const ident = this.previous();
            if (this.match(Token.INCR, Token.DECR)) {
                const op = this.previous();
                //return new Expr.PostAssign(ident, op, this.peek().pos);
                return new Expr.PostAssign(new Expr.Variable(ident, this.peek().pos), op, this.peek().pos);
            }
            return new Expr.Variable(this.previous(), this.peek().pos);
        }
        */


        var expr = null;
        if (this.match(Token.IDENT)) {
            expr = new Expr.Variable(this.previous(), this.peek().pos);
        }


        else if (this.match(Token.LBRACE)) {

            expr = new Expr.Object(this.objectValue(), this.peek().pos);
        }

        else if (this.match(Token.LPAREN)) {

            let expr1 = this.expression();
            this.consume(Token.RPAREN, "Expect ')' after expression.");
            expr = new Expr.Grouping(expr1, this.peek().pos);
        }





        return expr;

    }


    ifStatement(): Stmt.Statement {
        this.consume(Token.LPAREN, "Expect '(' after 'if'.");
        const condition: Expr.Expression = this.expression();

        this.consume(Token.RPAREN, "Expect ')' after if condition."); // [parens]

        const thenBranch: Stmt.Statement = this.statement();
        let elseBranch: Stmt.Statement = null;

        if (this.match(Token.ELSE)) {
            elseBranch = this.statement();
        }

        return new Stmt.If(condition, thenBranch, elseBranch, this.peek().pos);
    }

    _function(kind: string) {
        let name: Item = this.consume(Token.IDENT, "Expect " + kind + " name.");

        this.consume(Token.LPAREN, "Expect '(' after " + kind + " name.");
        const parameters: Item[] = [];
        if (!this.check(Token.RPAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.");
                }

                parameters.push(
                    this.consume(Token.IDENT, "Expect parameter name."));
            } while (this.match(Token.COMMA));
        }
        this.consume(Token.RPAREN, "Expect ')' after parameters.");

        this.consume(Token.LBRACE, "Expect '{' before " + kind + " body.");
        const body: Stmt.Statement[] = this.block();
        console.log("This.peek ", this.peek())
        return new Stmt.Function(name, parameters, body, this.peek().pos);

    }

    varDeclaration() {
        const name = this.consume(Token.IDENT, "Expect variable name.");

        let initializer: Expr.Expression = null;
        if (this.match(Token.ASSIGN)) {
            initializer = this.expression();
        }

        //this.consume(Token.SEMICOLON, "Expect ';' after variable declaration.");
        if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
            this.consume(Token.SEMICOLON, "Expect ';' after expression..");
        }

        return new Stmt.Var(name, initializer, this.peek().pos);
    }

    arrayValue() {
        const values = [];
        if (this.match(Token.RBRACK)) {
            return values;
        }

        do {
            values.push(this.or());
        } while (this.match(Token.COMMA));

        this.consume(Token.RBRACK, "Expect ']'.");

        return values;
    }

    objectValue(ambiguity?) {
        const pairs: any = [];

        if (this.match(Token.RBRACE)) {
            if (ambiguity) {
                this.error(this.peek(), "error of ambiguity");
            }

            return pairs;

        }

        do {

            let name = null;
            let value = null;
            if (this.peek().tok == Token.IDENT || this.peek().tok == Token.STRING || this.peek().tok == Token.INT) {

                name = new Expr.Literal(this.peek().value, this.peek().pos, this.peek().tok);
                this.advance()

            } else if (this.match(Token.LBRACK)) {
                name = this.or();
                this.consume(Token.RBRACK, "Expect ']' after property id");
            }

            this.consume(Token.COLON, "Expect ':'.");

            value = this.or();
            pairs.push({
                id: name,
                value
            });

        } while (this.match(Token.COMMA));

        this.match(Token.SEMICOLON);

        this.consume(Token.RBRACE, "Expect '}'.");
        return pairs;
    }

    isObjectId() {
        if (this.peek().tok == Token.IDENT || this.peek().tok == Token.STRING || this.peek().tok == Token.INT) {
            return {
                name: this.peek().value,
                type: this.peek().tok
            }
        }


    }

    nameObjectId() {
        if (this.peek().tok == Token.LBRACK) {


        }
    }

    doStatement(): Stmt.Statement {

        const body: Stmt.Statement = this.statement();

        this.consume(Token.WHILE, "Expect 'while' token after statement.")

        this.consume(Token.LPAREN, "Expect '(' after 'if'.");
        const condition: Expr.Expression = this.expression();

        this.consume(Token.RPAREN, "Expect ')' after if condition.");

        return new Stmt.Do(condition, body, this.peek().pos);
    }

    whileStatement(): Stmt.Statement {
        this.consume(Token.LPAREN, "Expect '(' after 'while'.");
        let condition: Expr.Expression = this.expression();
        this.consume(Token.RPAREN, "Expect ')' after condition.");
        const body: Stmt.Statement = this.statement();

        return new Stmt.While(condition, body, this.peek().pos);
    }

    returnStatement() {
        //Token keyword: I = previous();
        let value: Expr.Expression = null;
        if (!this.check(Token.SEMICOLON)) {
            value = this.expression();
        }

        if (!this.match(Token.SEMICOLON, Token.EOL) && !Token.EOF) {
            this.consume(Token.SEMICOLON, "Expect ';' after expression..");
        }
        //this.consume(Token.SEMICOLON, "Expect ';' after return value.");
        return new Stmt.Return(value, this.peek().pos);
    }



    forStatement(): Stmt.Statement {
        this.consume(Token.LPAREN, "Expect '(' after 'for'.");


        let initializer: Stmt.Statement;
        if (this.match(Token.SEMICOLON)) {
            initializer = null;
        } else if (this.match(Token.LET)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }


        let condition: Expr.Expression = null;
        if (!this.check(Token.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(Token.SEMICOLON, "Expect ';' after loop condition.");


        let increment: Expr.Expression = null;
        if (!this.check(Token.RPAREN)) {
            increment = this.expression();
        }
        this.consume(Token.RPAREN, "Expect ')' after for clauses.");

        let body: Stmt.Statement = this.statement();

        // for-desugar-increment
        if (increment != null) {
            body = new Stmt.Block(
                [
                    body,
                    new Stmt.Expression(increment, [], this.peek().pos)
                ], this.peek().pos);
        }

        if (condition == null) condition = new Expr.Literal(true, this.peek().pos);
        body = new Stmt.While(condition, body, this.peek().pos);

        if (initializer != null) {
            body = new Stmt.Block([initializer, body], this.peek().pos);
        }

        return body;
    }

    printStatement() {
        const value: Expr.Expression = this.expression();
        this.consume(Token.SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value, this.peek().pos);
    }
}