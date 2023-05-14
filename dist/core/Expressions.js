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
var PostAssign = /** @class */ (function () {
    function PostAssign(name, operator) {
        this.name = name;
        this.operator = operator;
    }
    PostAssign.prototype.accept = function (visitor) {
        return visitor.visitPostExpr(this);
    };
    return PostAssign;
}());
export { PostAssign };
var PreAssign = /** @class */ (function () {
    function PreAssign(name, operator) {
        this.name = name;
        this.operator = operator;
    }
    PreAssign.prototype.accept = function (visitor) {
        return visitor.visitPreExpr(this);
    };
    return PreAssign;
}());
export { PreAssign };
var Variable = /** @class */ (function () {
    function Variable(name) {
        this.name = name;
    }
    Variable.prototype.accept = function (visitor) {
        return visitor.visitVariableExpr(this);
    };
    return Variable;
}());
export { Variable };
var Assign = /** @class */ (function () {
    function Assign(name, value) {
        this.name = name;
        this.value = value;
    }
    Assign.prototype.accept = function (visitor) {
        return visitor.visitAssignExpr(this);
    };
    return Assign;
}());
export { Assign };
var Get = /** @class */ (function () {
    function Get(object, name) {
        this.object = object;
        this.name = name;
    }
    Get.prototype.accept = function (visitor) {
        return visitor.visitGetExpr(this);
    };
    return Get;
}());
export { Get };
var Set = /** @class */ (function () {
    function Set(object, name, value) {
        this.object = object;
        this.name = name;
        this.value = value;
    }
    Set.prototype.accept = function (visitor) {
        return visitor.visitSetExpr(this);
    };
    return Set;
}());
export { Set };
var Logical = /** @class */ (function () {
    function Logical(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    Logical.prototype.accept = function (visitor) {
        return visitor.visitLogicalExpr(this);
    };
    return Logical;
}());
export { Logical };
//# sourceMappingURL=Expressions.js.map