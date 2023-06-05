/*
export interface Expression {
  accept(visitor: any);
}
*/
var Expression = /** @class */ (function () {
    function Expression() {
    }
    return Expression;
}());
export { Expression };
var Binary = /** @class */ (function () {
    function Binary(left, operator, right, pos) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Binary.prototype.accept = function (visitor) {
        return visitor.visitBinaryExpr(this);
    };
    return Binary;
}());
export { Binary };
var Literal = /** @class */ (function () {
    function Literal(value, pos, type) {
        this.value = null;
        this.type = 0;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Literal.prototype.accept = function (visitor) {
        return visitor.visitLiteralExpr(this);
    };
    return Literal;
}());
export { Literal };
var Unary = /** @class */ (function () {
    function Unary(operator, right, pos) {
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Unary.prototype.accept = function (visitor) {
        return visitor.visitUnaryExpr(this);
    };
    return Unary;
}());
export { Unary };
var Grouping = /** @class */ (function () {
    function Grouping(expression, pos) {
        this.expression = expression;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Grouping.prototype.accept = function (visitor) {
        return visitor.visitGroupingExpr(this);
    };
    return Grouping;
}());
export { Grouping };
var PostAssign = /** @class */ (function () {
    function PostAssign(name, operator, pos) {
        this.name = name;
        this.operator = operator;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    PostAssign.prototype.accept = function (visitor) {
        return visitor.visitPostExpr(this);
    };
    return PostAssign;
}());
export { PostAssign };
var PreAssign = /** @class */ (function () {
    function PreAssign(name, operator, pos) {
        this.name = name;
        this.operator = operator;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    PreAssign.prototype.accept = function (visitor) {
        return visitor.visitPreExpr(this);
    };
    return PreAssign;
}());
export { PreAssign };
var Variable = /** @class */ (function () {
    function Variable(name, pos) {
        this.name = name;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Variable.prototype.accept = function (visitor) {
        return visitor.visitVariableExpr(this);
    };
    return Variable;
}());
export { Variable };
var Assign = /** @class */ (function () {
    function Assign(name, value, type, pos) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Assign.prototype.accept = function (visitor) {
        return visitor.visitAssignExpr(this);
    };
    return Assign;
}());
export { Assign };
var Get = /** @class */ (function () {
    function Get(object, name, pos) {
        this.object = object;
        this.name = name;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Get.prototype.accept = function (visitor) {
        return visitor.visitGetExpr(this);
    };
    return Get;
}());
export { Get };
var Set = /** @class */ (function () {
    function Set(object, name, value, type, pos) {
        this.object = object;
        this.name = name;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Set.prototype.accept = function (visitor) {
        return visitor.visitSetExpr(this);
    };
    return Set;
}());
export { Set };
var Get2 = /** @class */ (function () {
    function Get2(object, name, pos) {
        this.object = object;
        this.name = name;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Get2.prototype.accept = function (visitor) {
        return visitor.visitGet2Expr(this);
    };
    return Get2;
}());
export { Get2 };
var Set2 = /** @class */ (function () {
    function Set2(object, name, value, type, pos) {
        this.object = object;
        this.name = name;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Set2.prototype.accept = function (visitor) {
        return visitor.visitSet2Expr(this);
    };
    return Set2;
}());
export { Set2 };
var Logical = /** @class */ (function () {
    function Logical(left, operator, right, pos) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Logical.prototype.accept = function (visitor) {
        return visitor.visitLogicalExpr(this);
    };
    return Logical;
}());
export { Logical };
var Par = /** @class */ (function () {
    function Par(id, value, pos) {
        this.id = id;
        this.value = value;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Par.prototype.accept = function (visitor) {
        return visitor.visitObjectExpr(this);
    };
    return Par;
}());
export { Par };
var Object = /** @class */ (function () {
    function Object(childs, pos) {
        this.childs = childs;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Object.prototype.accept = function (visitor) {
        return visitor.visitObjectExpr(this);
    };
    return Object;
}());
export { Object };
var Array = /** @class */ (function () {
    function Array(childs, pos) {
        this.childs = childs;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Array.prototype.accept = function (visitor) {
        return visitor.visitArrayExpr(this);
    };
    return Array;
}());
export { Array };
var Call = /** @class */ (function () {
    function Call(callee, paren, arg, pos) {
        this.callee = callee;
        this.paren = paren;
        this.arg = arg;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Call.prototype.accept = function (visitor) {
        return visitor.visitCallExpr(this);
    };
    return Call;
}());
export { Call };
var Ternary = /** @class */ (function () {
    function Ternary(condition, exprTrue, exprFalse, pos) {
        this.condition = condition;
        this.exprTrue = exprTrue;
        this.exprFalse = exprFalse;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Ternary.prototype.accept = function (visitor) {
        return visitor.visitTernaryExpr(this);
    };
    return Ternary;
}());
export { Ternary };
var Super = /** @class */ (function () {
    function Super(keyword, method, pos) {
        this.keyword = keyword;
        this.method = method;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    Super.prototype.accept = function (visitor) {
        return visitor.visitSuperExpr(this);
    };
    return Super;
}());
export { Super };
var This = /** @class */ (function () {
    function This(keyword, pos) {
        this.keyword = keyword;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    This.prototype.accept = function (visitor) {
        return visitor.visitThisExpr(this);
    };
    return This;
}());
export { This };
//# sourceMappingURL=Expressions%20copy.js.map