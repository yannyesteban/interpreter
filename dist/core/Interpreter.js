import { Token } from "./Token.js";
import { Environment } from "./Environment.js";
import { FunctionR } from "./FunctionR.js";
import { CallableR } from "./CallableR.js";
import { InstanceR } from "./InstanceR.js";
import { ClassR } from "./ClassR.js";
import { ReturnR } from "./ReturnR.js";
var Interpreter = /** @class */ (function () {
    function Interpreter() {
        this.globals = new Environment();
        this.environment = this.globals;
        this.locals = new Map();
    }
    Interpreter.prototype.interpret = function (statements) {
        try {
            for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                var statement = statements_1[_i];
                this.execute(statement);
            }
        }
        catch (error) {
            //Lox.runtimeError(error);
        }
    };
    Interpreter.prototype.evaluate = function (expr) {
        return expr.accept(this);
    };
    Interpreter.prototype.execute = function (stmt) {
        stmt.accept(this);
    };
    Interpreter.prototype.resolve = function (expr, depth) {
        this.locals.set(expr, depth);
    };
    Interpreter.prototype.executeBlock = function (statements, environment) {
        var previous = this.environment;
        try {
            this.environment = environment;
            for (var _i = 0, statements_2 = statements; _i < statements_2.length; _i++) {
                var statement = statements_2[_i];
                this.execute(statement);
            }
        }
        finally {
            this.environment = previous;
        }
    };
    Interpreter.prototype.visitBlockStmt = function (stmt) {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    };
    Interpreter.prototype.visitClassStmt = function (stmt) {
        var superclass = null;
        if (stmt.superclass != null) {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof ClassR)) {
                throw ""; //new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }
        this.environment.define(stmt.name.value, null);
        if (stmt.superclass != null) {
            this.environment = new Environment(this.environment);
            this.environment.define("super", superclass);
        }
        var methods = new Map();
        for (var _i = 0, _a = stmt.methods; _i < _a.length; _i++) {
            var method = _a[_i];
            var func = new FunctionR(method, this.environment, method.name.lexeme.equals("init"));
            methods[method.name.lexeme] = func;
        }
        var klass = new ClassR(stmt.name.value, superclass, methods);
        if (superclass != null) {
            this.environment = this.environment.enclosing;
        }
        this.environment.assign(stmt.name, klass);
        return null;
    };
    Interpreter.prototype.visitExpressionStmt = function (stmt) {
        this.evaluate(stmt.expression);
        return null;
    };
    Interpreter.prototype.visitFunctionStmt = function (stmt) {
        var _function = new FunctionR(stmt, this.environment, false);
        this.environment.define(stmt.name.lexeme, _function);
        return null;
    };
    Interpreter.prototype.visitIfStmt = function (stmt) {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        }
        else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    };
    Interpreter.prototype.visitPrintStmt = function (stmt) {
        var value = this.evaluate(stmt.expression);
        console.log("Printing", this.stringify(value));
        return null;
    };
    Interpreter.prototype.visitReturnStmt = function (stmt) {
        var value = null;
        if (stmt.value != null) {
            value = this.evaluate(stmt.value);
        }
        throw new ReturnR(value);
    };
    Interpreter.prototype.visitVarStmt = function (stmt) {
        var value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.value, value);
        return null;
    };
    Interpreter.prototype.visitWhileStmt = function (stmt) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return null;
    };
    Interpreter.prototype.visitAssignExpr = function (expr) {
        var value = this.evaluate(expr.value);
        var distance = this.locals.get(expr);
        if (distance != null) {
            this.environment.assignAt(distance, expr.name, value);
        }
        else {
            this.globals.assign(expr.name, value);
        }
        return value;
    };
    Interpreter.prototype.visitBinaryExpr = function (expr) {
        var left = this.evaluate(expr.left);
        var right = this.evaluate(expr.right);
        console.log("typeof left ", typeof left == "number");
        console.log("left ", left, " right ", right);
        switch (expr.operator.tok) {
            //> binary-equality
            case Token.NEQ: return !this.isEqual(left, right);
            case Token.EQL: return this.isEqual(left, right);
            case Token.GTR:
                this.checkNumberOperands(expr.operator, left, right);
                return left > right;
            case Token.GEQ:
                this.checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case Token.LSS:
                this.checkNumberOperands(expr.operator, left, right);
                return left < right;
            case Token.LEQ:
                this.checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case Token.SUB:
                this.checkNumberOperands(expr.operator, left, right);
                return (left - right);
            case Token.ADD:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }
                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }
                throw ""; //new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case Token.DIV:
                this.checkNumberOperands(expr.operator, left, right);
                return left / right;
            case Token.MUL:
                this.checkNumberOperands(expr.operator, left, right);
                return left * right;
        }
        // Unreachable.
        return null;
    };
    Interpreter.prototype.visitCallExpr = function (expr) {
        var callee = this.evaluate(expr.callee);
        var _arguments = [];
        for (var _i = 0, _a = expr.arg; _i < _a.length; _i++) {
            var _argument = _a[_i];
            _arguments.push(this.evaluate(_argument));
        }
        if (!(callee instanceof CallableR)) {
            throw ""; //new RuntimeError(expr.paren, "Can only call functions and classes.");
        }
        var _function = callee;
        if (_arguments.length != _function.arity()) {
            throw ""; //new RuntimeError(expr.paren, "Expected " + _function.arity() + " arguments but got " + _arguments.length + ".");
        }
        return _function.call(this, _arguments);
    };
    Interpreter.prototype.visitGetExpr = function (expr) {
        var object = this.evaluate(expr.object);
        if (object instanceof InstanceR) {
            return object.get(expr.name);
        }
        throw ""; //new RuntimeError(expr.name,           "Only instances have properties.");
    };
    Interpreter.prototype.visitGroupingExpr = function (expr) {
        return this.evaluate(expr.expression);
    };
    Interpreter.prototype.visitLiteralExpr = function (expr) {
        console.log("visitLiteralExpr", expr);
        if (expr.type == Token.INT || expr.type == Token.FLOAT) {
            return +expr.value;
        }
        return expr.value;
    };
    Interpreter.prototype.visitLogicalExpr = function (expr) {
        var left = this.evaluate(expr.left);
        if (expr.operator.tok == Token.OR) {
            if (this.isTruthy(left))
                return left;
        }
        else {
            if (!this.isTruthy(left))
                return left;
        }
        return this.evaluate(expr.right);
    };
    Interpreter.prototype.visitSetExpr = function (expr) {
        var object = this.evaluate(expr.object);
        if (!(object instanceof InstanceR)) { // [order]
            throw ""; //new RuntimeError(expr.name,                "Only instances have fields.");
        }
        var value = this.evaluate(expr.value);
        object.set(expr.name, value);
        return value;
    };
    Interpreter.prototype.visitSuperExpr = function (expr) {
        var distance = this.locals.get(expr);
        var superclass = this.environment.getAt(distance, "super");
        var object = this.environment.getAt(distance - 1, "this");
        var method = superclass.findMethod(expr.method.value);
        if (method == null) {
            throw ""; //new RuntimeError(expr.method, "Undefined property '" + expr.method.value + "'.");
        }
        return method.bind(object);
    };
    Interpreter.prototype.visitThisExpr = function (expr) {
        return this.lookUpVariable(expr.keyword, expr);
    };
    Interpreter.prototype.visitUnaryExpr = function (expr) {
        var right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            //> unary-bang
            case Token.NOT:
                return !this.isTruthy(right);
            //< unary-bang
            case Token.SUB:
                //> check-unary-operand
                this.checkNumberOperand(expr.operator, right);
                //< check-unary-operand
                return -right;
        }
        // Unreachable.
        return null;
    };
    Interpreter.prototype.visitVariableExpr = function (expr) {
        return this.lookUpVariable(expr.name, expr);
    };
    Interpreter.prototype.lookUpVariable = function (name, expr) {
        var distance = this.locals.get(expr);
        if (distance != null) {
            return this.environment.getAt(distance, name.value);
        }
        else {
            return this.globals.get(name);
        }
    };
    Interpreter.prototype.checkNumberOperand = function (operator, operand) {
        if (typeof operand == "number") {
            return;
        }
        throw ""; //new RuntimeError(operator, "Operand must be a number.");
    };
    Interpreter.prototype.checkNumberOperands = function (operator, left, right) {
        if (typeof left == "number" && typeof right == "number") {
            return;
        }
        throw ""; //new RuntimeError(operator, "Operands must be numbers.");
    };
    Interpreter.prototype.isTruthy = function (object) {
        if (object == null)
            return false;
        if (object instanceof Boolean)
            return object;
        return true;
    };
    Interpreter.prototype.isEqual = function (a, b) {
        if (a == null && b == null)
            return true;
        if (a == null)
            return false;
        return a == b;
    };
    Interpreter.prototype.stringify = function (object) {
        if (object == null)
            return "nil";
        if (typeof object == "number") {
            var text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }
        return object.toString();
    };
    return Interpreter;
}());
export { Interpreter };
//# sourceMappingURL=Interpreter.js.map