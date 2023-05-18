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
    function Assign(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = type;
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
    function Set(object, name, value, type) {
        this.object = object;
        this.name = name;
        this.value = value;
        this.type = type;
    }
    Set.prototype.accept = function (visitor) {
        return visitor.visitSetExpr(this);
    };
    return Set;
}());
export { Set };
var Get2 = /** @class */ (function () {
    function Get2(object, name) {
        this.object = object;
        this.name = name;
    }
    Get2.prototype.accept = function (visitor) {
        return visitor.visitGet2Expr(this);
    };
    return Get2;
}());
export { Get2 };
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
var Par = /** @class */ (function () {
    function Par(id, value) {
        this.id = id;
        this.value = value;
    }
    Par.prototype.accept = function (visitor) {
        return visitor.visitObjectExpr(this);
    };
    return Par;
}());
export { Par };
var Object = /** @class */ (function () {
    function Object(childs) {
        this.childs = childs;
    }
    Object.prototype.accept = function (visitor) {
        return visitor.visitObjectExpr(this);
    };
    return Object;
}());
export { Object };
var Array = /** @class */ (function () {
    function Array(childs) {
        this.childs = childs;
    }
    Array.prototype.accept = function (visitor) {
        return visitor.visitArrayExpr(this);
    };
    return Array;
}());
export { Array };
var Call = /** @class */ (function () {
    function Call(callee, paren, arg) {
        this.callee = callee;
        this.paren = paren;
        this.arg = arg;
    }
    Call.prototype.accept = function (visitor) {
        return visitor.visitCallExpr(this);
    };
    return Call;
}());
export { Call };
var Ternary = /** @class */ (function () {
    function Ternary(cond, exprTrue, exprFalse) {
        this.cond = cond;
        this.exprTrue = exprTrue;
        this.exprFalse = exprFalse;
    }
    Ternary.prototype.accept = function (visitor) {
        return visitor.visitTernaryExpr(this);
    };
    return Ternary;
}());
export { Ternary };
//# sourceMappingURL=Expressions.js.map