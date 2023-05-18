var Block = /** @class */ (function () {
    function Block(statements) {
        this.statements = statements;
    }
    Block.prototype.accept = function (visitor) {
        return visitor.visitBlockStmt(this);
    };
    return Block;
}());
export { Block };
var Expression = /** @class */ (function () {
    function Expression(expression) {
        //console.log("Expression: ", expression);
        this.expression = expression;
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
    }
    Do.prototype.accept = function (visitor) {
        return visitor.visitDoStmt(this);
    };
    return Do;
}());
export { Do };
//# sourceMappingURL=Statement.js.map