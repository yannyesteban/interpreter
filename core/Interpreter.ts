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
    public output: string[] = [];

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

        return this.output;
    }

    private evaluate(expr: Expr.Expression) {
        return expr.accept(this);
    }

    private execute(stmt: Stmt.Statement) {
        stmt.accept(this);
    }

    resolve(expr: Expr.Expression, depth: number) {
        console.log("Resolve", expr, depth)
        this.locals.set(expr, depth);
    }

    executeBlock(statements: Stmt.Statement[], environment: Environment) {
        const previous: Environment = this.environment;
        try {
            this.environment = environment;

            for (const statement of statements) {
                console.log("executeBlock", statement)
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
            const func: FunctionR = new FunctionR(method, this.environment, method.name.value == "init");
            methods[method.name.value] = func;
        }

        const klass: ClassR = new ClassR(stmt.name.value, superclass as ClassR, methods);

        if (superclass != null) {
            this.environment = this.environment.enclosing;
        }

        this.environment.assign(stmt.name, klass);
        return null;
    }

    visitExpressionStmt(stmt: Stmt.Expression) {
        console.log("---> ", stmt.expression)
        let value = this.evaluate(stmt.expression);
        console.log("RESULT A", value);
        if (stmt.mods) {
            value = this.evalMods(value, stmt.mods);
        }
        console.log("RESULT B:", value);

        if (stmt.expression.clss !== "Assign" && stmt.expression.clss !== "Set" && stmt.expression.clss !== "Set2"
            && stmt.expression.clss !== "PostAssign") {
            this.output.push(value);
        }

        return null;
    }

    visitFunctionStmt(stmt: Stmt.Function) {
        console.log("visitFunctionStmt")
        const _function: FunctionR = new FunctionR(stmt, this.environment, false);
        this.environment.define(stmt.name.value, _function);
        return null;
    }

    visitIfStmt(stmt: Stmt.If) {
        console.log("Condition ", this.isTruthy(this.evaluate(stmt.condition)))
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }

    visitPrintStmt(stmt: Stmt.Print) {
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
        console.log("visitVarStmt A", stmt.initializer)
        let value: Object = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.value, value);
        console.log("visitVarStmt B")
        return null;
    }

    visitWhileStmt(stmt: Stmt.While) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return null;
    }

    visitAssignExpr(expr: Expr.Assign) {
        console.log("ASSIGN ---- ")
        const value: Object = this.evaluate(expr.value);

        const distance: number = this.locals.get(expr);
        if (distance != null) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.globals.assign(expr.name, value);
        }

        return value;
    }
    visitPostExpr(expr: Expr.PostAssign) {
        console.log("visitPostExpr ---- ")


        let old = this.lookUpVariable(expr.name, expr);
        let value = old;
        if(expr.operator.tok == Token.INCR){
            value++; 
        }else{
            value--;
        } 
        
        const distance: number = this.locals.get(expr);
        if (distance != null) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.globals.assign(expr.name, value);
        }

        return old;
    }
    visitPreExpr(expr: Expr.PostAssign) {
        console.log("visitPreExpr ---- ")


        let old = this.lookUpVariable(expr.name, expr);
        let value = old;
        if(expr.operator.tok == Token.INCR){
            value++; 
        }else{
            value--;
        } 
        console.log("New Value ", value)
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

            case Token.POW:
                this.checkNumberOperands(expr.operator, left, right);
                return left ** right;
            case Token.GTR:
                this.checkNumberOperands(expr.operator, left, right);
                console.log("comparing", left > right)
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
        console.log("visitCallExpr");
        console.log(expr)

        const callee: Object = this.evaluate(expr.callee);

        console.log("callee ", callee.constructor)

        const _arguments: Object[] = [];
        for (const _argument of expr.arg) {
            _arguments.push(this.evaluate(_argument));
        }

        if (!(callee instanceof CallableR)) {
            console.log(1, "an only call functions and classes.")
            throw "an only call functions and classes." //new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        const _function: CallableR = callee;
        if (_arguments.length != _function.arity()) {
            alert(8)
            throw "Expected " + _function.arity() + " arguments but got " + _arguments.length + "."//new RuntimeError(expr.paren, "Expected " + _function.arity() + " arguments but got " + _arguments.length + ".");
        }
        console.log("good")
        return _function.call(this, _arguments);
    }

    visitGetExpr(expr: Expr.Get) {
        const object: Object = this.evaluate(expr.object) as InstanceR;
        if (object instanceof InstanceR) {
            return object.get(expr.name);
        }

        if (typeof object == "object") {
            console.log(object, expr.name.value)
            return object[expr.name.value];
        }

        throw "Only instances have properties."//new RuntimeError(expr.name,           "Only instances have properties.");
    }

    visitGet2Expr(expr: Expr.Get2) {
        const object: Object = this.evaluate(expr.object) as InstanceR;
        if (object instanceof InstanceR) {
            let index = this.evaluate(expr.name);
            return object.get(index);
        }

        if (typeof object == "object") {

            let index = this.evaluate(expr.name);
            return object[index];
        }

        throw "Only instances have properties."//new RuntimeError(expr.name,           "Only instances have properties.");
    }

    visitGroupingExpr(expr: Expr.Grouping) {
        return this.evaluate(expr.expression);
    }

    visitLiteralExpr(expr: Expr.Literal) {


        console.log("visitLiteralExpr", expr)
        if (expr.type == Token.INT || expr.type == Token.FLOAT) {
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

        console.log(" SET ----")
        const object: Object = this.evaluate(expr.object);

        if (!(object instanceof InstanceR) && typeof object !== "object") { // [order]
            throw "" //new RuntimeError(expr.name,                "Only instances have fields.");
        }
        const value: Object = this.evaluate(expr.value);
        if ((object instanceof InstanceR)) { // [order]
            object.set(expr.name, value);
        }

        object[expr.name.value] = value;

        return value;
    }

    visitSet2Expr(expr: Expr.Set2) {

        console.log(" SET ----")
        const object: Object = this.evaluate(expr.object);

        if (!(object instanceof InstanceR) && typeof object !== "object") { // [order]
            throw "" //new RuntimeError(expr.name,                "Only instances have fields.");
        }
        let index = this.evaluate(expr.name);
        const value: Object = this.evaluate(expr.value);
        if ((object instanceof InstanceR)) { // [order]
            object.set(index, value);
        }


        object[index] = value;

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

    visitObjectExpr(expr: Expr.Object) {

        const o = {};
        //console.error("visitObjectExpr", expr);
        expr.childs.forEach(ch => {
            o[this.evaluate(ch.id)] = this.evaluate(ch.value);
            //console.log("...", this.evaluate(ch.id));
            //console.log("name of ", this.evaluate(ch.name))
            //o[this.evaluate(ch.)]=
        })
        //console.error("visitObjectExpr", expr);
        console.log("json\n", JSON.stringify(o));
        return o;
    }

    visitArrayExpr(expr: Expr.Array) {
        const a = [];

        expr.childs.forEach(ch => {
            a.push(this.evaluate(ch));
            //console.log("...", this.evaluate(ch.id));
            //console.log("name of ", this.evaluate(ch.name))
            //o[this.evaluate(ch.)]=
        });
        console.log("json\n", JSON.stringify(a));

        return a;

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
        if (object == null) {
            return false;
        }
        if (typeof object === "boolean") {
            return object;
        }

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

    public getDate(date: string | number | object | Date) {
        if (typeof date === "string") {
            let aux = date.split("-");
            return new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
        }

        if (date instanceof Date) {
            return date;
        }

    }

    public evalMod(data: any, mod: Stmt.Modifier) {
        const name = mod.name;
        let param = null;
        if (mod.param) {
            param = this.evaluate(mod.param);
        }
        console.log("PARAM ", param)

        switch (name.toLowerCase()) {
            case "trim":
                data = data.toString();
                if (param) {
                    if (param.toLowerCase() == "left") {
                        return data.trimStart();
                    } else if (param.toLowerCase() == "right") {
                        return data.trimEnd();
                    }
                }
                return data.trim();

            case "upper":
                return data.toString().toUpperCase();
            case "lower":
                return data.toString().toLowerCase();
            case "floor":
                return Math.floor(Number(data)).toString();
            case "ceil":
                return Math.ceil(Number(data)).toString();
            case "abs":
                return Math.abs(Number(data)).toString();
            case "format":
                const digits = param["digits"] || 2;
                return new Intl.NumberFormat(param["locales"] || undefined, {
                    minimumFractionDigits: digits,
                    maximumFractionDigits: digits
                }).format(Number(data));
            case "date":
                return this.getDate(data).toLocaleDateString(param["locales"] || undefined);
            case "time":
                return this.getDate(data).toLocaleTimeString();
            case "tofixed":
                return Number(data).toFixed(Number(param || 0));
            case "pretty":
                if (typeof data === "object") {
                    data = JSON.stringify(data, null, 2);
                }
                return data
        }
        return data;
    }

    public evalMods(data: string | number | object | Date, mods: Stmt.Modifier[]) {

        let aux = {};
        mods.forEach(mod => {
            console.log(mod)
            data = this.evalMod(data, mod)
        });

        if (typeof data == "number") {
            return data.toString();
        }

        if (typeof data == "object") {
            return JSON.stringify(data)
        }

        return data;
    }
}
