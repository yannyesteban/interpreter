var Binary = /** @class */ (function () {
    function Binary(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    Binary.prototype.accept = function (visitor) {
        return visitor.visitBinaryExpr(this);
    };
    return Binary;
}());
export { Binary };
var Literal = /** @class */ (function () {
    function Literal(value) {
        this.value = null;
        this.value = value;
    }
    Literal.prototype.accept = function (visitor) {
        return visitor.visitLiteralExpr(this);
    };
    return Literal;
}());
export { Literal };
var Unary = /** @class */ (function () {
    function Unary(operator, right) {
        this.operator = operator;
        this.right = right;
    }
    Unary.prototype.accept = function (visitor) {
        return visitor.visitUnaryExpr(this);
    };
    return Unary;
}());
export { Unary };
var Grouping = /** @class */ (function () {
    function Grouping(expression) {
        this.expression = expression;
    }
    Grouping.prototype.accept = function (visitor) {
        return visitor.visitGroupingExpr(this);
    };
    return Grouping;
}());
export { Grouping };
//# sourceMappingURL=Expressions.js.map