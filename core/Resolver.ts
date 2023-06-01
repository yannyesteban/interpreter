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

class Stack {

    private list: Object[] = [];

    public peek() {
        return this.list[this.list.length - 1];
    }
    public isEmpty() {

        return this.list.length === 0;

    }
    public push(value) {
        this.list.push(value);

    }
    public pop() {
        return this.list.pop();
         

    }
    
    public length() {
        return this.list.length;
    }


    public get(index) {
        return  this.list[index];
    }

    public put(key, value){
        this.list[this.list.length - 1][key] = value;   
    }

    public is(key){
        return key in this.list[this.list.length - 1];   
    }

}

export class Resolver {

    private interpreter: Interpreter;
    private scopes = new Stack();
    private currentFunction: FunctionType = FunctionType.NONE;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    private currentClass: ClassType = ClassType.NONE;

    resolve(s: Stmt.Statement[] | Stmt.Statement | Expr.Expression | Stmt.Expression | any) {
        
        console.log("Statement ", s);
      
        if (Array.isArray(s)) {
            console.log("Array ", s);

            for (const statement of s) {
                console.log(statement)
                this.resolve(statement);
            }
        } else if (s instanceof Expr.Expression) {
            console.log("Statement 1", s)
            s.accept(this);
        }
        else if (s instanceof Stmt.Statement) {
            console.log("Statement 2", s)
            s.accept(this);

        }else  if (s instanceof Stmt.Expression){
            console.log("Statement NOOOOO", s)
            s.accept(this);

        }else{
            console.log("Statement ELSE", s)
            s.accept(this);
        }
        
        //throw "error X"

    }

    visitBlockStmt(stmt: Stmt.Block) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }

    public visitClassStmt(stmt: Stmt.Class) {

        let enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASS;
        this.declare(stmt.name);
        this.define(stmt.name);

        if (stmt.superclass != null &&
            stmt.name.value.equals(stmt.superclass.name.value)) {
            throw "A class can't inherit from itself.";    
            //Lox.error(stmt.superclass.name,           "A class can't inherit from itself.");
        }

        if (stmt.superclass != null) {
            this.currentClass = ClassType.SUBCLASS;
            this.resolve(stmt.superclass);
        }

        if (stmt.superclass != null) {
            this.beginScope();
            this.scopes.put("super", true);
        }

        this.beginScope();
        this.scopes.put("this", true);

        for (const method of stmt.methods) {

            let declaration: FunctionType = FunctionType.METHOD;

            if (method.name.value =="init") {
                declaration = FunctionType.INITIALIZER;
            }

            this.resolveFunction(method, declaration); // [local]
        }

        this.endScope();

        if (stmt.superclass != null) this.endScope();

        this.currentClass = enclosingClass;
        return null;
    }

    visitExpressionStmt(stmt: Stmt.Expression) {
        console.log("visitExpressionStmt", stmt)
        this.resolve(stmt.expression);
        return null;
    }

    visitFunctionStmt(stmt: Stmt.Function) {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    }

    visitIfStmt(stmt: Stmt.If) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch != null) this.resolve(stmt.elseBranch);
        return null;
    }
    
    visitPrintStmt(stmt: Stmt.Print) {
        console.log("visitPrintStmt");
        this.resolve(stmt.expression);
        return null;
    }
    

    visitReturnStmt(stmt: Stmt.Return) {
        if (this.currentFunction == FunctionType.NONE) {
            throw "Can't return from top-level code.";
            //Lox.error(stmt.keyword, "Can't return from top-level code.");
        }

        if (stmt.value != null) {
            if (this.currentFunction == FunctionType.INITIALIZER) {
                throw "Can't return a value from an initializer.";
                //Lox.error(stmt.keyword,"Can't return a value from an initializer.");
            }

            this.resolve(stmt.value);
        }

        return null;
    }

    visitVarStmt(stmt: Stmt.Var) {
        console.log("visitVarStmt", stmt)
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }

    visitWhileStmt(stmt: Stmt.While) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }

    visitAssignExpr(expr: Expr.Assign) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitBinaryExpr(expr: Expr.Binary) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitCallExpr(expr: Expr.Call) {
        this.resolve(expr.callee);

        for (let arg of expr.arg) {
            this.resolve(arg);
        }

        return null;
    }

    visitGetExpr(expr: Expr.Get) {
        this.resolve(expr.object);
        return null;
    }

    visitGroupingExpr(expr: Expr.Grouping) {
        this.resolve(expr.expression);
        return null;
    }

    visitLiteralExpr(expr: Expr.Literal) {
        return null;
    }

    visitLogicalExpr(expr: Expr.Logical) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitSetExpr(expr: Expr.Set) {
        this.resolve(expr.value);
        this.resolve(expr.object);
        return null;
    }

    visitSuperExpr(expr: Expr.Super) {
        if (this.currentClass == ClassType.NONE) {
            throw "Can't use 'super' outside of a class.";
            //Lox.error(expr.keyword,       "Can't use 'super' outside of a class.");
        } else if (this.currentClass != ClassType.SUBCLASS) {
            throw "Can't use 'super' in a class with no superclass.";
            //Lox.error(expr.keyword,          "Can't use 'super' in a class with no superclass.");
        }

        this.resolveLocal(expr, expr.keyword);
        return null;
    }

    visitThisExpr(expr: Expr.This) {
        if (this.currentClass == ClassType.NONE) {
            throw "Can't use 'this' outside of a class.";
            //Lox.error(expr.keyword,           "Can't use 'this' outside of a class.");
            return null;
        }

        this.resolveLocal(expr, expr.keyword);
        return null;
    }


    visitUnaryExpr(expr: Expr.Unary) {
        console.log("visitUnaryExpr", expr);
        this.resolve(expr.right);
        return null;
    }

    visitVariableExpr(expr: Expr.Variable) {
        console.log("visitVariableExpr", expr.name.value, expr);
        if (!this.scopes.isEmpty() && this.scopes.peek()[expr.name.value] == false) {
            throw "Can't read local variable in its own initializer.";
            //Lox.error(expr.name, "Can't read local variable in its own initializer.");
        }

        this.resolveLocal(expr, expr.name);
        return null;
    }
    
    visitObjectExpr(expr: Expr.Object){
        console.error("visitObjectExpr", expr);
    }

    private resolveFunction(_function: Stmt.Function, type) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        for (let param of _function.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(_function.body);
        this.endScope();
        this.currentFunction = enclosingFunction;
    }

    private beginScope() {
        this.scopes.push({});
    }

    private endScope() {
        this.scopes.pop();
    }

    private declare(name: Item) {
        if (this.scopes.isEmpty()) return;

        //let scope = this.scopes.peek();
        if (this.scopes.peek() && name.value in this.scopes.peek()) {
            throw "Already a variable with this name in this scope.";
            //Lox.error(name, "Already a variable with this name in this scope.");
        }

        this.scopes.put(name.value, false);
    }

    private define(name: Item) {
        if (this.scopes.isEmpty()) {
            return;
        }
        this.scopes.put(name.value, true);
    }

    private resolveLocal(expr: Expr.Expression, name: Item) {
        for (let i = this.scopes.length() - 1; i >= 0; i--) {
            if (name.value in this.scopes.get(i)) {
                this.interpreter.resolve(expr, this.scopes.length() - 1 - i);
                return;
            }
        }
    }
}
