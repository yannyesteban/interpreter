import { Interpreter } from "./Interpreter.js";
import { Lexer, Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";

export enum FunctionType {
    NONE,
    FUNCTION,
    INITIALIZER,
    METHOD
}

export enum ClassType {
    NONE,
    CLASS,
    SUBCLASS
}


export class Resolver {
    private interpreter: Interpreter;
    //> scopes-field
    private scopes = [];
    //< scopes-field
    //> function-type-field
    private currentFunction: FunctionType = FunctionType.NONE;
    //< function-type-field

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
    //> function-type

    //< function-type
    //> Classes class-type



    private currentClass: ClassType = ClassType.NONE;

    //< Classes class-type
    //> resolve-statements
    resolve(s: Stmt.Statement[] | Stmt.Statement | Expr.Expression) {

        if (Array.isArray(s)) {
            for (const statement: Stmt.Statement of s) {
                this.resolve(statement);
            }
        } else if (s instanceof Expr.Expression) {

            s.accept(this);
        }
        else if (s instanceof Stmt.Statement) {

            s.accept(this);

        }


    }

    //< resolve-statements
    //> visit-block-stmt

    visitBlockStmt(stmt: Stmt.Block) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }
    //< visit-block-stmt
    //> Classes resolver-visit-class

    public visitClassStmt(stmt: Stmt.Class) {

        //> set-current-class
        let enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASS;

        //< set-current-class
        this.declare(stmt.name);
        this.define(stmt.name);
        //> Inheritance resolve-superclass

        //> inherit-self
        if (stmt.superclass != null &&
            stmt.name.value.equals(stmt.superclass.name.value)) {
            //Lox.error(stmt.superclass.name,           "A class can't inherit from itself.");
        }

        //< inherit-self
        if (stmt.superclass != null) {
            //> set-current-subclass
            this.currentClass = ClassType.SUBCLASS;
            //< set-current-subclass
            this.resolve(stmt.superclass);
        }
        //< Inheritance resolve-superclass
        //> Inheritance begin-super-scope

        if (stmt.superclass != null) {
            this.beginScope();
            this.scopes.peek().put("super", true);
        }
        //< Inheritance begin-super-scope
        //> resolve-methods

        //> resolver-begin-this-scope
        this.beginScope();
        this.scopes.peek().put("this", true);

        //< resolver-begin-this-scope
        for ( const method :Stmt.Function of stmt.methods) {
            let  declaration: FunctionType = FunctionType.METHOD;
            //> resolver-initializer-type
            if (method.name.lexeme.equals("init")) {
                declaration = FunctionType.INITIALIZER;
            }

            //< resolver-initializer-type
            this.resolveFunction(method, declaration); // [local]
        }

        //> resolver-end-this-scope
        this.endScope();

        //< resolver-end-this-scope
        //< resolve-methods
        //> Inheritance end-super-scope
        if (stmt.superclass != null) this.endScope();

        //< Inheritance end-super-scope
        //> restore-current-class
        this.currentClass = enclosingClass;
        //< restore-current-class
        return null;
    }
    //< Classes resolver-visit-class
    //> visit-expression-stmt

    visitExpressionStmt(stmt: Stmt.Expression) {
        this.resolve(stmt.expression);
        return null;
    }
    //< visit-expression-stmt
    //> visit-function-stmt

    visitFunctionStmt(stmt: Stmt.Function) {
        this.declare(stmt.name);
        this.define(stmt.name);

        /* Resolving and Binding visit-function-stmt < Resolving and Binding pass-function-type
            resolveFunction(stmt);
        */
        //> pass-function-type
        this.resolveFunction(stmt, FunctionType.FUNCTION);
        //< pass-function-type
        return null;
    }
    //< visit-function-stmt
    //> visit-if-stmt

    visitIfStmt(stmt: Stmt.If) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch != null) this.resolve(stmt.elseBranch);
        return null;
    }
    //< visit-if-stmt
    //> visit-print-stmt
    /*
    visitPrintStmt(stmt: Stmt.Print) {
        this.resolve(stmt.expression);
        return null;
    }
    */
    //< visit-print-stmt
    //> visit-return-stmt

    visitReturnStmt(stmt: Stmt.Return) {
        //> return-from-top
        if (this.currentFunction == FunctionType.NONE) {
            //Lox.error(stmt.keyword, "Can't return from top-level code.");
        }

        //< return-from-top
        if (stmt.value != null) {
            //> Classes return-in-initializer
            if (this.currentFunction == FunctionType.INITIALIZER) {
                //Lox.error(stmt.keyword,"Can't return a value from an initializer.");
            }

            //< Classes return-in-initializer
            this.resolve(stmt.value);
        }

        return null;
    }
    //< visit-return-stmt
    //> visit-var-stmt

    visitVarStmt(stmt: Stmt.Var) {
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }
    //< visit-var-stmt
    //> visit-while-stmt

    visitWhileStmt(stmt: Stmt.While) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }
    //< visit-while-stmt
    //> visit-assign-expr

    visitAssignExpr(expr: Expr.Assign) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }
    //< visit-assign-expr
    //> visit-binary-expr

    visitBinaryExpr(expr: Expr.Binary) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }
    //< visit-binary-expr
    //> visit-call-expr

    visitCallExpr(expr: Expr.Call) {
        this.resolve(expr.callee);

        for (let arg of expr.arg) {
            this.resolve(arg);
        }

        return null;
    }
    //< visit-call-expr
    //> Classes this.resolver-visit-get

    visitGetExpr(expr: Expr.Get) {
        this.resolve(expr.object);
        return null;
    }
    //< Classes this.resolver-visit-get
    //> visit-grouping-expr

    visitGroupingExpr(expr: Expr.Grouping) {
        this.resolve(expr.expression);
        return null;
    }
    //< visit-grouping-expr
    //> visit-literal-expr

    visitLiteralExpr(expr: Expr.Literal) {
        return null;
    }
    //< visit-literal-expr
    //> visit-logical-expr

    visitLogicalExpr(expr: Expr.Logical) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }
    //< visit-logical-expr
    //> Classes this.resolver-visit-set

    visitSetExpr(expr: Expr.Set) {
        this.resolve(expr.value);
        this.resolve(expr.object);
        return null;
    }
    //< Classes this.resolver-visit-set
    //> Inheritance this.resolve-super-expr

    visitSuperExpr(expr: Expr.Super) {
        //> invalid-super
        if (this.currentClass == ClassType.NONE) {
            //Lox.error(expr.keyword,       "Can't use 'super' outside of a class.");
        } else if (this.currentClass != ClassType.SUBCLASS) {
            //Lox.error(expr.keyword,          "Can't use 'super' in a class with no superclass.");
        }

        //< invalid-super
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    //< Inheritance this.resolve-super-expr
    //> Classes this.resolver-visit-this

    visitThisExpr(expr: Expr.This) {
        //> this-outside-of-class
        if (this.currentClass == ClassType.NONE) {
            //Lox.error(expr.keyword,           "Can't use 'this' outside of a class.");
            return null;
        }

        //< this-outside-of-class
        this.resolveLocal(expr, expr.keyword);
        return null;
    }

    //< Classes this.resolver-visit-this
    //> visit-unary-expr

    visitUnaryExpr(expr: Expr.Unary) {
        this.resolve(expr.right);
        return null;
    }
    //< visit-unary-expr
    //> visit-variable-expr

    visitVariableExpr(expr: Expr.Variable) {
        if (!this.scopes.isEmpty() &&
            this.scopes.peek().get(expr.name.value) == false) {
            //Lox.error(expr.name, "Can't read local variable in its own initializer.");
        }

        this.resolveLocal(expr, expr.name);
        return null;
    }
    //< visit-variable-expr
    //> this.resolve-stmt

    //< resolve-expr
    //> resolve-function
    /* Resolving and Binding resolve-function < Resolving and Binding set-current-function
      private resolveFunction(Stmt.Function function) {
    */
    //> set-current-function
    private resolveFunction(_function: Stmt.Function, type) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        //< set-current-function
        this.beginScope();
        for (let param of _function.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(_function.body);
        this.endScope();
        //> restore-current-function
        this.currentFunction = enclosingFunction;
        //< restore-current-function
    }
    //< resolve-function
    //> begin-scope
    private beginScope() {
        this.scopes.push({});
    }
    //< begin-scope
    //> end-scope
    private endScope() {
        this.scopes.pop();
    }
    //< end-scope
    //> declare
    private declare(name: Item) {
        if (this.scopes.isEmpty()) return;

        let scope = this.scopes.peek();
        //> duplicate-variable
        if (scope.containsKey(name.value)) {
            //Lox.error(name, "Already a variable with this name in this scope.");
        }

        //< duplicate-variable
        scope.put(name.value, false);
    }
    //< declare
    //> define
    private define(name: Item) {
        if (this.scopes.isEmpty()) return;
        this.scopes.peek().put(name.value, true);
    }
    //< define
    //> resolve-local
    private resolveLocal(expr: Expr.Expression, name: Item) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes.get(i).containsKey(name.value)) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }
    //< resolve-local
}
