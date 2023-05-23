import { Keyword, Token } from "./Token.js";
import { Lexer, Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";

import { Environment } from "./Environment.js";
import { FunctionR } from "./FunctionR.js";
import { CallableR } from "./CallableR.js";
import { InstanceR } from "./InstanceR.js";
import { ClassR } from "./ClassR.js";
import { ReturnR } from "./ReturnR.js";


export class Interpreter {

    private globals: Environment = new Environment();
    private environment: Environment = this.globals;
    public locals = new Map();

    constructor() {

    }

    interpret(statements: Stmt.Statement[]) {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            //Lox.runtimeError(error);
        }
    }

    private evaluate(expr: Stmt.Statement) {
        return expr.accept(this);
    }

    private execute(stmt: Stmt.Statement) {
        stmt.accept(this);
    }

    resolve(expr: Stmt.Statement, depth: number) {
        this.locals.set(expr, depth);
    }

    executeBlock(statements: Stmt.Statement[], environment: Environment) {
        const previous: Environment = this.environment;
        try {
            this.environment = environment;

            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    visitBlockStmt(stmt: Stmt.Block) {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }

    visitClassStmt(stmt: Stmt.Class) {
        let superclass: Object = null;
        if (stmt.superclass != null) {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof ClassR)) {
                throw ""//new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }

        this.environment.define(stmt.name.value, null);

        if (stmt.superclass != null) {
            this.environment = new Environment(this.environment);
            this.environment.define("super", superclass);
        }

        let methods = new Map();
        for (const method of stmt.methods) {
            const func: FunctionR = new FunctionR(method, this.environment, method.name.lexeme.equals("init"));
            methods[method.name.lexeme] = func;
        }
        
        const klass: ClassR = new ClassR(stmt.name.value, superclass as ClassR, methods);

        if (superclass != null) {
            this.environment = this.environment.enclosing;
        }

        this.environment.assign(stmt.name, klass);
        return null;
    }

    visitExpressionStmt(stmt: Stmt.Expression) {
        this.evaluate(stmt.expression);
        return null;
    }

    visitFunctionStmt(stmt: Stmt.Function) {
        const _function: FunctionR = new FunctionR(stmt, this.environment, false);
        this.environment.define(stmt.name.lexeme, _function);
        return null;
    }

    visitIfStmt(stmt: Stmt.If) {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }

    visitPrintStmt( stmt: Stmt.Print) {
        const value: object = this.evaluate(stmt.expression);
        console.log("Printing", this.stringify(value));
        return null;
      }

    visitReturnStmt(stmt: Stmt.Return) {
        let value: Object = null;
        if (stmt.value != null) {
            value = this.evaluate(stmt.value);
        }

        throw new ReturnR(value);
    }

    visitVarStmt(stmt: Stmt.Var) {
        let value: Object = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.value, value);
        return null;
    }

    visitWhileStmt(stmt: Stmt.While) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return null;
    }

    visitAssignExpr(expr: Expr.Assign) {
        const value: Object = this.evaluate(expr.value);

        const distance: number = this.locals.get(expr);
        if (distance != null) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.globals.assign(expr.name, value);
        }

        return value;
    }

    visitBinaryExpr(expr: Expr.Binary) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        console.log("typeof left ", typeof left == "number")
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

                throw "" //new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case Token.DIV:
                this.checkNumberOperands(expr.operator, left, right);
                return left / right;
            case Token.MUL:
                this.checkNumberOperands(expr.operator, left, right);
                return left * right;
        }

        // Unreachable.
        return null;
    }

    public visitCallExpr(expr: Expr.Call) {
        const callee: Object = this.evaluate(expr.callee);

        const _arguments: Object[] = [];
        for (const _argument of expr.arg) {
            _arguments.push(this.evaluate(_argument));
        }

        if (!(callee instanceof CallableR)) {
            throw "" //new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        const _function: CallableR = callee;
        if (_arguments.length != _function.arity()) {
            throw ""//new RuntimeError(expr.paren, "Expected " + _function.arity() + " arguments but got " + _arguments.length + ".");
        }

        return _function.call(this, _arguments);
    }

    visitGetExpr(expr: Expr.Get) {
        const object: Object = this.evaluate(expr.object) as InstanceR;
        if (object instanceof InstanceR) {
            return object.get(expr.name);
        }

        throw ""//new RuntimeError(expr.name,           "Only instances have properties.");
    }

    visitGroupingExpr(expr: Expr.Grouping) {
        return this.evaluate(expr.expression);
    }

    visitLiteralExpr(expr: Expr.Literal) {


        console.log("visitLiteralExpr", expr)
        if(expr.type == Token.INT || expr.type == Token.FLOAT){
            return +expr.value
        }
        return expr.value;
    }

    visitLogicalExpr(expr: Expr.Logical) {
        const left: Object = this.evaluate(expr.left);

        if (expr.operator.tok == Token.OR) {
            if (this.isTruthy(left)) return left;
        } else {
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }

    visitSetExpr(expr: Expr.Set) {
        const object: Object = this.evaluate(expr.object);

        if (!(object instanceof InstanceR)) { // [order]
            throw "" //new RuntimeError(expr.name,                "Only instances have fields.");
        }

        const value: Object = this.evaluate(expr.value);
        object.set(expr.name, value);
        return value;
    }

    visitSuperExpr(expr: Expr.Super) {
        const distance: number = this.locals.get(expr);
        const superclass: ClassR = this.environment.getAt(distance, "super");

        const object: InstanceR = this.environment.getAt(distance - 1, "this");

        const method: FunctionR = superclass.findMethod(expr.method.value);

        if (method == null) {
            throw "" //new RuntimeError(expr.method, "Undefined property '" + expr.method.value + "'.");
        }

        return method.bind(object);
    }

    visitThisExpr(expr: Expr.This) {
        return this.lookUpVariable(expr.keyword, expr);
    }

    visitUnaryExpr(expr: Expr.Unary) {
        const right: Object = this.evaluate(expr.right);

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
    }

    visitVariableExpr(expr: Expr.Variable) {
        return this.lookUpVariable(expr.name, expr);
    }

    lookUpVariable(name: Item, expr: Expr.Expression) {
        const distance: number = this.locals.get(expr);
        if (distance != null) {
            return this.environment.getAt(distance, name.value);
        } else {
            return this.globals.get(name);
        }
    }
    
    private checkNumberOperand(operator: Item, operand: Object) {
        if (typeof operand == "number") {
            return;
        }
        throw "" //new RuntimeError(operator, "Operand must be a number.");
    }
    
    private checkNumberOperands(operator: Item, left: Object, right: Object) {
        if (typeof left == "number" && typeof right == "number") {
            return;
        }

        throw "" //new RuntimeError(operator, "Operands must be numbers.");
    }

    private isTruthy(object: Object) {
        if (object == null) return false;
        if (object instanceof Boolean) return object;
        return true;
    }

    private isEqual(a: Object, b: Object) {
        if (a == null && b == null) return true;
        if (a == null) return false;

        return a == b;
    }

    private stringify(object: Object) {
        if (object == null) return "nil";

        if (typeof object == "number") {
            let text: string = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }

        return object.toString();
    }
}
