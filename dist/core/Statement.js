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
        console.log("Expression: ", expression);
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
//# sourceMappingURL=Statement.js.map