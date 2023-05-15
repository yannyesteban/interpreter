import { Token } from "./Token.js";
import { Lexer, Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";

//const source = 'if (3>=6) 6+6*2 || 2';
//let lexer = new Lexer(source);

//console.log(source, "\n", lexer.getTokens());


//console.log("bye");



type exp = any;
export class Parser {

    public tokens: Item[];
    public current = 0;

    constructor(tokens) {
        this.tokens = tokens;
    }


    error(token, message) {
        if (token.type == Token.EOF) {
            //report(token.line, " at end", message);
        } else {
            //report(token.line, " at '" + token.lexeme + "'", message);
        }
    }
    parse(): Stmt.Statement[] {
        let statements = [];
        while (!this.isAtEnd()) {
            /* Statements and State parse < Statements and State parse-declaration
                  statements.add(statement());
            */
            //> parse-declaration
            statements.push(this.declaration());
            //< parse-declaration
        }

        return statements; // [parse-error-handling]
    }
    peek() {
        return this.tokens[this.current];
    }

    isAtEnd() {
        return this.peek().tok == Token.EOF;
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

    private expressionStatement() {
        let expr = this.expression();
        this.consume(Token.SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
    }

    private block() {
        let statements/*: Expr.Expression[]*/  = [];

        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(Token.RBRACE, "Expect '}' after block.");
        return statements;
    }

    private statement() {

        //if (this.match(Token.FOR)) return this.forStatement();


        if (this.match(Token.IF)) {
            return this.ifStatement();
        }

        //if (this.match(Token.PRINT)) return printStatement();

        //if (this.match(Token.RETURN)) return this.returnStatement();


        //if (this.match(Token.WHILE)) return this.whileStatement();

        if(this.peek().tok == Token.LBRACE){
            
            return this.expressionObj();
        }

        if (this.match(Token.LBRACE)) {
            return new Stmt.Block(this.block());
        }


        return this.expressionStatement();
    }

    declaration() {
        console.log("declaration")
        try {

            //if (this.match(Token.CLASS)) return this.classDeclaration();
            //if (this.match(Token.FUNC)) return this._function("function");
            console.log("mi token 46----->", this.peek())
            if (this.match(Token.LET)) {
                console.log("mi token 46")
                return this.varDeclaration();
            }

            return this.statement();
        } catch (/*ParseError*/ error) {
            console.log(error)
            throw error;
            //this.synchronize();
            return null;
        }
        return null;
    }

    comparison() {
        let expr: exp = this.term();

        while (this.match(Token.GTR, Token.GEQ, Token.LSS, Token.LEQ)) {
            let operator = this.previous();
            let right: exp = this.term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (this.match(Token.NEQ, Token.EQL)) {
            let operator: Item = this.previous();
            let right: exp = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    expression() {
        //return this.equality();
        return this.assignment();
    }

    assignment() {
        /* Statements and State parse-assignment < Control Flow or-in-assignment
            Expr expr = equality();
        */
        //> Control Flow or-in-assignment
        let expr: Expr.Expression = this.or();
        //< Control Flow or-in-assignment

        if (this.match(Token.EQL)) {
            const equals: Item = this.previous();
            let value: Expr.Expression = this.assignment();

            if (expr instanceof Expr.Variable) {
                const name: Item = expr.name;
                return new Expr.Assign(name, value);
                //> Classes assign-set
            } else if (expr instanceof Expr.Get) {
                const get: Expr.Get = expr;
                return new Expr.Set(get.object, get.name, value);
                //< Classes assign-set
            }

            this.error(equals, "Invalid assignment target."); // [no-throw]
        }

        return expr;
    }
    or(): Expr.Expression {
        let expr: Expr.Expression = this.and();

        while (this.match(Token.OR)) {
            const operator: Item = this.previous();
            const right: Expr.Expression = this.and();
            expr = new Expr.Logical(expr, operator, right);
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
            expr = new Expr.Logical(expr, operator, right);
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
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    factor() {
        let expr: exp = this.unary();

        while (this.match(Token.MUL, Token.DIV)) {
            let operator = this.previous();
            let right = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    unary() {
        if (this.match(Token.SUB, Token.NOT)) {
            let operator = this.previous();
            let right = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.primary();
    }

    primary() {
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
            console.log("number or string.............")
            return new Expr.Literal(this.previous().value);
        }

        if (this.match(Token.INCR, Token.DECR)) {
            console.log("post ASIGn");
            let id = null;
            let op = this.previous();
            if (this.match(Token.IDENT)) {
                console.log("post ASIGN 2");
                id = this.previous();
                return new Expr.PostAssign(id, op)
            }
            console.log("post ASIGN 5");

            throw new Error("expected a identifier");

        }
        if (this.match(Token.LPAREN)) {
            let expr = this.expression();
            this.consume(Token.RPAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }
    }


    ifStatement(): Expr.Expression {
        this.consume(Token.LPAREN, "Expect '(' after 'if'.");
        const condition: Expr.Expression = this.expression();
        this.consume(Token.RPAREN, "Expect ')' after if condition."); // [parens]

        const thenBranch: Stmt.Statement = this.statement();
        let elseBranch: Stmt.Statement = null;

        if (this.match(Token.ELSE)) {
            elseBranch = this.statement();
        }

        return new Stmt.If(condition, thenBranch, elseBranch);
    }

    varDeclaration() {
        const name = this.consume(Token.IDENT, "Expect variable name.");

        let initializer: Expr.Expression = null;
        if (this.match(Token.ASSIGN)) {
            initializer = this.expression();
        }

        this.consume(Token.SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    }

    expressionObj(){

        console.log("Peek: ", this.peek())
        if(this.match(Token.LBRACE)){
            let x = this.peek();
            console.log("Peek 2: ", x)
        }

        throw "error";
        return new Expr.Object(null);
    }

    isObjectId(){
        if(this.peek().tok == Token.IDENT  || this.peek().tok == Token.STRING || this.peek().tok == Token.INT){
            return {
                name: this.peek().value,
                type: this.peek().tok
            }
        }
    }

    nameObjectId(){
        if(this.peek().tok == Token.LBRACK){

            
        }
    }
}