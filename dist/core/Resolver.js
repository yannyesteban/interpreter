import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
export var FunctionType;
(function (FunctionType) {
    FunctionType[FunctionType["NONE"] = 0] = "NONE";
    FunctionType[FunctionType["FUNCTION"] = 1] = "FUNCTION";
    FunctionType[FunctionType["INITIALIZER"] = 2] = "INITIALIZER";
    FunctionType[FunctionType["METHOD"] = 3] = "METHOD";
})(FunctionType || (FunctionType = {}));
export var ClassType;
(function (ClassType) {
    ClassType[ClassType["NONE"] = 0] = "NONE";
    ClassType[ClassType["CLASS"] = 1] = "CLASS";
    ClassType[ClassType["SUBCLASS"] = 2] = "SUBCLASS";
})(ClassType || (ClassType = {}));
class Stack {
    constructor() {
        this.list = [];
    }
    peek() {
        return this.list[this.list.length - 1];
    }
    isEmpty() {
        return this.list.length === 0;
    }
    push(value) {
        this.list.push(value);
    }
    pop() {
        return this.list.pop();
    }
    length() {
        return this.list.length;
    }
    get(index) {
        return this.list[index];
    }
    put(key, value) {
        this.list[this.list.length - 1][key] = value;
    }
    is(key) {
        return key in this.list[this.list.length - 1];
    }
}
export class Resolver {
    constructor(interpreter) {
        this.scopes = new Stack();
        this.currentFunction = FunctionType.NONE;
        this.currentClass = ClassType.NONE;
        this.interpreter = interpreter;
    }
    resolve(s) {
        console.log("Statement ", s);
        if (Array.isArray(s)) {
            console.log("Array ", s);
            for (const statement of s) {
                console.log(statement);
                this.resolve(statement);
            }
        }
        else if (s instanceof Expr.Expression) {
            console.log("Statement 1", s);
            s.accept(this);
        }
        else if (s instanceof Stmt.Statement) {
            console.log("Statement 2", s);
            s.accept(this);
        }
        else if (s instanceof Stmt.Expression) {
            console.log("Statement NOOOOO", s);
            s.accept(this);
        }
        else {
            console.log("Statement ELSE", s);
            s.accept(this);
        }
        //throw "error X"
    }
    visitBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }
    visitClassStmt(stmt) {
        console.log(" visitClassStmt x");
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
            let declaration = FunctionType.METHOD;
            if (method.name.value == "init") {
                declaration = FunctionType.INITIALIZER;
            }
            this.resolveFunction(method, declaration); // [local]
        }
        this.endScope();
        if (stmt.superclass != null)
            this.endScope();
        this.currentClass = enclosingClass;
        return null;
    }
    visitExpressionStmt(stmt) {
        console.log("visitExpressionStmt", stmt);
        this.resolve(stmt.expression);
        return null;
    }
    visitFunctionStmt(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    }
    visitIfStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch != null)
            this.resolve(stmt.elseBranch);
        return null;
    }
    visitPrintStmt(stmt) {
        console.log("visitPrintStmt");
        this.resolve(stmt.expression);
        return null;
    }
    visitReturnStmt(stmt) {
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
    visitVarStmt(stmt) {
        console.log("visitVarStmt", stmt);
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }
    visitWhileStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }
    visitAssignExpr(expr) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }
    visitBinaryExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }
    visitCallExpr(expr) {
        this.resolve(expr.callee);
        for (let arg of expr.arg) {
            this.resolve(arg);
        }
        return null;
    }
    visitGetExpr(expr) {
        this.resolve(expr.object);
        return null;
    }
    visitGroupingExpr(expr) {
        this.resolve(expr.expression);
        return null;
    }
    visitLiteralExpr(expr) {
        return null;
    }
    visitLogicalExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }
    visitSetExpr(expr) {
        this.resolve(expr.value);
        this.resolve(expr.object);
        return null;
    }
    visitSuperExpr(expr) {
        if (this.currentClass == ClassType.NONE) {
            throw "Can't use 'super' outside of a class.";
            //Lox.error(expr.keyword,       "Can't use 'super' outside of a class.");
        }
        else if (this.currentClass != ClassType.SUBCLASS) {
            throw "Can't use 'super' in a class with no superclass.";
            //Lox.error(expr.keyword,          "Can't use 'super' in a class with no superclass.");
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    visitThisExpr(expr) {
        if (this.currentClass == ClassType.NONE) {
            throw "Can't use 'this' outside of a class.";
            //Lox.error(expr.keyword,           "Can't use 'this' outside of a class.");
            return null;
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    visitUnaryExpr(expr) {
        console.log("visitUnaryExpr", expr);
        this.resolve(expr.right);
        return null;
    }
    visitVariableExpr(expr) {
        console.log("visitVariableExpr", expr.name.value, expr);
        if (!this.scopes.isEmpty() && this.scopes.peek()[expr.name.value] == false) {
            throw "Can't read local variable in its own initializer.";
            //Lox.error(expr.name, "Can't read local variable in its own initializer.");
        }
        this.resolveLocal(expr, expr.name);
        return null;
    }
    visitObjectExpr(expr) {
        console.error("visitObjectExpr", expr);
    }
    visitPreExpr(expr) {
        console.error("visitPreExpr", expr);
    }
    visitPostExpr(expr) {
        console.error("visitPostExpr", expr);
    }
    visitArrayExpr(expr) {
        console.error("visitArrayExpr", expr);
    }
    visitTernaryExpr(expr) {
        console.error("visitTernaryExpr", expr);
    }
    resolveFunction(_function, type) {
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
    beginScope() {
        this.scopes.push({});
    }
    endScope() {
        this.scopes.pop();
    }
    declare(name) {
        if (this.scopes.isEmpty()) {
            return;
        }
        //let scope = this.scopes.peek();
        if (this.scopes.peek() && name.value in this.scopes.peek()) {
            throw "Already a variable with this name in this scope.";
            //Lox.error(name, "Already a variable with this name in this scope.");
        }
        this.scopes.put(name.value, false);
    }
    define(name) {
        if (this.scopes.isEmpty()) {
            return;
        }
        this.scopes.put(name.value, true);
    }
    resolveLocal(expr, name) {
        for (let i = this.scopes.length() - 1; i >= 0; i--) {
            if (name.value in this.scopes.get(i)) {
                this.interpreter.resolve(expr, this.scopes.length() - 1 - i);
                return;
            }
        }
    }
}
//# sourceMappingURL=Resolver.js.map