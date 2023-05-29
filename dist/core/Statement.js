var Modifier = /** @class */ (function () {
    function Modifier(name, param) {
        this.name = name;
        this.param = param;
    }
    return Modifier;
}());
export { Modifier };
var Statement = /** @class */ (function () {
    function Statement() {
    }
    return Statement;
}());
export { Statement };
var Block = /** @class */ (function () {
    function Block(statements) {
        this.statements = statements;
        this.clssStmt = this.constructor.name;
    }
    Block.prototype.accept = function (visitor) {
        return visitor.visitBlockStmt(this);
    };
    return Block;
}());
export { Block };
var Expression = /** @class */ (function () {
    function Expression(expression, mods) {
        //console.log("Expression: ", expression);
        this.expression = expression;
        this.mods = mods;
        this.clssStmt = this.constructor.name;
    }
    Expression.prototype.accept = function (visitor) {
        return visitor.visitExpressionStmt(this);
    };
    return Expression;
}());
export { Expression };
var If = /** @class */ (function () {
    function If(condition, thenBranch, elseBranch) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
        this.clssStmt = this.constructor.name;
    }
    If.prototype.accept = function (visitor) {
        return visitor.visitIfStmt(this);
    };
    return If;
}());
export { If };
var Function = /** @class */ (function () {
    function Function(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
        this.clssStmt = this.constructor.name;
    }
    Function.prototype.accept = function (visitor) {
        return visitor.visitFunctionStmt(this);
    };
    return Function;
}());
export { Function };
var Var = /** @class */ (function () {
    function Var(name, initializer) {
        this.name = name;
        this.initializer = initializer;
        this.clssStmt = this.constructor.name;
    }
    Var.prototype.accept = function (visitor) {
        return visitor.visitVarStmt(this);
    };
    return Var;
}());
export { Var };
var Return = /** @class */ (function () {
    function Return(value) {
        this.value = value;
        this.clssStmt = this.constructor.name;
    }
    Return.prototype.accept = function (visitor) {
        return visitor.visitReturnStmt(this);
    };
    return Return;
}());
export { Return };
var While = /** @class */ (function () {
    function While(condition, body) {
        this.condition = condition;
        this.body = body;
        this.clssStmt = this.constructor.name;
    }
    While.prototype.accept = function (visitor) {
        return visitor.visitWhileStmt(this);
    };
    return While;
}());
export { While };
var Do = /** @class */ (function () {
    function Do(condition, body) {
        this.condition = condition;
        this.body = body;
        this.clssStmt = this.constructor.name;
    }
    Do.prototype.accept = function (visitor) {
        return visitor.visitDoStmt(this);
    };
    return Do;
}());
export { Do };
var Class = /** @class */ (function () {
    function Class(name, superclass, methods) {
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
        this.clssStmt = this.constructor.name;
    }
    Class.prototype.accept = function (visitor) {
        return visitor.visitClassStmt(this);
    };
    return Class;
}());
export { Class };
var Print = /** @class */ (function () {
    function Print(expression) {
        this.expression = expression;
        this.clssStmt = this.constructor.name;
    }
    Print.prototype.accept = function (visitor) {
        return visitor.visitPrintStmt(this);
    };
    return Print;
}());
export { Print };
//# sourceMappingURL=Statement.js.map