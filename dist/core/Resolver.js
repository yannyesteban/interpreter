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
var Stack = /** @class */ (function () {
    function Stack() {
        this.list = [];
    }
    Stack.prototype.peek = function () {
        return this.list[this.list.length - 1];
    };
    Stack.prototype.isEmpty = function () {
        return this.list.length === 0;
    };
    Stack.prototype.push = function (value) {
        this.list.push(value);
    };
    Stack.prototype.pop = function () {
        return this.list.pop();
    };
    Stack.prototype.length = function () {
        return this.list.length;
    };
    Stack.prototype.get = function (index) {
        return this.list[index];
    };
    Stack.prototype.put = function (key, value) {
        this.list[this.list.length - 1][key] = value;
    };
    Stack.prototype.is = function (key) {
        return key in this.list[this.list.length - 1];
    };
    return Stack;
}());
var Resolver = /** @class */ (function () {
    function Resolver(interpreter) {
        this.scopes = new Stack();
        this.currentFunction = FunctionType.NONE;
        this.currentClass = ClassType.NONE;
        this.interpreter = interpreter;
    }
    Resolver.prototype.resolve = function (s) {
        console.log("Statement ", s);
        if (Array.isArray(s)) {
            console.log("Array ", s);
            for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
                var statement = s_1[_i];
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
    };
    Resolver.prototype.visitBlockStmt = function (stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    };
    Resolver.prototype.visitClassStmt = function (stmt) {
        var enclosingClass = this.currentClass;
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
        for (var _i = 0, _a = stmt.methods; _i < _a.length; _i++) {
            var method = _a[_i];
            var declaration = FunctionType.METHOD;
            if (method.name.lexeme.equals("init")) {
                declaration = FunctionType.INITIALIZER;
            }
            this.resolveFunction(method, declaration); // [local]
        }
        this.endScope();
        if (stmt.superclass != null)
            this.endScope();
        this.currentClass = enclosingClass;
        return null;
    };
    Resolver.prototype.visitExpressionStmt = function (stmt) {
        console.log("visitExpressionStmt", stmt);
        this.resolve(stmt.expression);
        return null;
    };
    Resolver.prototype.visitFunctionStmt = function (stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    };
    Resolver.prototype.visitIfStmt = function (stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch != null)
            this.resolve(stmt.elseBranch);
        return null;
    };
    Resolver.prototype.visitPrintStmt = function (stmt) {
        console.log("visitPrintStmt");
        this.resolve(stmt.expression);
        return null;
    };
    Resolver.prototype.visitReturnStmt = function (stmt) {
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
    };
    Resolver.prototype.visitVarStmt = function (stmt) {
        console.log("visitVarStmt", stmt);
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    };
    Resolver.prototype.visitWhileStmt = function (stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    };
    Resolver.prototype.visitAssignExpr = function (expr) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    };
    Resolver.prototype.visitBinaryExpr = function (expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    };
    Resolver.prototype.visitCallExpr = function (expr) {
        this.resolve(expr.callee);
        for (var _i = 0, _a = expr.arg; _i < _a.length; _i++) {
            var arg = _a[_i];
            this.resolve(arg);
        }
        return null;
    };
    Resolver.prototype.visitGetExpr = function (expr) {
        this.resolve(expr.object);
        return null;
    };
    Resolver.prototype.visitGroupingExpr = function (expr) {
        this.resolve(expr.expression);
        return null;
    };
    Resolver.prototype.visitLiteralExpr = function (expr) {
        return null;
    };
    Resolver.prototype.visitLogicalExpr = function (expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    };
    Resolver.prototype.visitSetExpr = function (expr) {
        this.resolve(expr.value);
        this.resolve(expr.object);
        return null;
    };
    Resolver.prototype.visitSuperExpr = function (expr) {
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
    };
    Resolver.prototype.visitThisExpr = function (expr) {
        if (this.currentClass == ClassType.NONE) {
            throw "Can't use 'this' outside of a class.";
            //Lox.error(expr.keyword,           "Can't use 'this' outside of a class.");
            return null;
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    };
    Resolver.prototype.visitUnaryExpr = function (expr) {
        console.log("visitUnaryExpr", expr);
        this.resolve(expr.right);
        return null;
    };
    Resolver.prototype.visitVariableExpr = function (expr) {
        console.log("visitVariableExpr", expr.name.value, expr);
        if (!this.scopes.isEmpty() && this.scopes.peek()[expr.name.value] == false) {
            throw "Can't read local variable in its own initializer.";
            //Lox.error(expr.name, "Can't read local variable in its own initializer.");
        }
        this.resolveLocal(expr, expr.name);
        return null;
    };
    Resolver.prototype.resolveFunction = function (_function, type) {
        var enclosingFunction = this.currentFunction;
        this.currentFunction = type;
        this.beginScope();
        for (var _i = 0, _a = _function.params; _i < _a.length; _i++) {
            var param = _a[_i];
            this.declare(param);
            this.define(param);
        }
        this.resolve(_function.body);
        this.endScope();
        this.currentFunction = enclosingFunction;
    };
    Resolver.prototype.beginScope = function () {
        this.scopes.push({});
    };
    Resolver.prototype.endScope = function () {
        this.scopes.pop();
    };
    Resolver.prototype.declare = function (name) {
        if (this.scopes.isEmpty())
            return;
        //let scope = this.scopes.peek();
        if (this.scopes.peek() && name.value in this.scopes.peek()) {
            throw "Already a variable with this name in this scope.";
            //Lox.error(name, "Already a variable with this name in this scope.");
        }
        this.scopes.put(name.value, false);
    };
    Resolver.prototype.define = function (name) {
        if (this.scopes.isEmpty()) {
            return;
        }
        this.scopes.put(name.value, true);
    };
    Resolver.prototype.resolveLocal = function (expr, name) {
        for (var i = this.scopes.length() - 1; i >= 0; i--) {
            if (name.value in this.scopes.get(i)) {
                this.interpreter.resolve(expr, this.scopes.length() - 1 - i);
                return;
            }
        }
    };
    return Resolver;
}());
export { Resolver };
//# sourceMappingURL=Resolver.js.map