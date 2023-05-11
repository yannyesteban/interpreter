import { Token } from "./Token.js";
import { Lexer, Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";

//const source = 'if (3>=6) 6+6*2 || 2';
//let lexer = new Lexer(source);

//console.log(source, "\n", lexer.getTokens());


//console.log("bye");



type exp = any;
export class AST {

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

    match(TokenType) {
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
        let statements: Expr.Expression[] = [];
    
        while (!this.check(Token.RBRACE) && !this.isAtEnd()) {
          statements.push(this.declaration());
        }
    
        this.consume(Token.RBRACE, "Expect '}' after block.");
        return statements;
      }

    private statement() {
        
        //if (this.match([Token.FOR])) return this.forStatement();
        
        
        if (this.match([Token.IF])) {
            return this.ifStatement();
        }
        
        //if (this.match([Token.PRINT])) return printStatement();
        
        //if (this.match([Token.RETURN])) return this.returnStatement();
        
        
        //if (this.match([Token.WHILE])) return this.whileStatement();
        
        
        if (this.match([Token.LBRACE])) return new Stmt.Block(this.block());
        

        return this.expressionStatement();
    }

    declaration() {
        try {
            
            //if (this.match([Token.CLASS])) return this.classDeclaration();
            //if (this.match([Token.FUNC])) return this._function("function");
            //if (this.match([Token.LET])) return this.varDeclaration();

            return this.statement();
        } catch (/*ParseError*/ error) {
            //this.synchronize();
            return null;
        }
    }

    comparison() {
        let expr: exp = this.term();

        while (this.match([Token.GTR, Token.GEQ, Token.LSS, Token.LEQ])) {
            let operator = this.previous();
            let right: exp = this.term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (this.match([Token.NEQ, Token.EQL])) {
            let operator: Item = this.previous();
            let right: exp = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    expression() {
        return this.equality();
    }


    term() {
        let expr: exp = this.factor();

        while (this.match([Token.SUB, Token.ADD])) {
            let operator = this.previous();
            let right: exp = this.factor();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    factor() {
        let expr: exp = this.unary();

        while (this.match([Token.MUL, Token.DIV])) {
            let operator = this.previous();
            let right = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    unary() {
        if (this.match([Token.SUB, Token.NOT])) {
            let operator = this.previous();
            let right = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.primary();
    }

    primary() {
        if (this.match([Token.FALSE])) return new Expr.Literal(false);
        if (this.match([Token.TRUE])) return new Expr.Literal(true);
        if (this.match([Token.NULL])) return new Expr.Literal(null);

        if (this.match([Token.INT, Token.FLOAT, Token.STRING])) {
            return new Expr.Literal(this.previous().value);
        }

        if (this.match([Token.LPAREN])) {
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
}