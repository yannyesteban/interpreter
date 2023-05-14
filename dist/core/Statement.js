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
//# sourceMappingURL=Statement.js.map