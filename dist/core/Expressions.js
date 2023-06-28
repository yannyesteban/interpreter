/*
export interface Expression {
  accept(visitor: any);
}
*/
export class Expression {
}
export class Binary {
    constructor(left, operator, right, pos) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
export class Literal {
    constructor(value, pos, type) {
        this.value = null;
        this.type = 0;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
export class Unary {
    constructor(operator, right, pos) {
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
export class Grouping {
    constructor(expression, pos) {
        this.expression = expression;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
export class PostAssign {
    constructor(name, operator, pos) {
        this.name = name;
        this.operator = operator;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitPostExpr(this);
    }
}
export class PreAssign {
    constructor(name, operator, pos) {
        this.name = name;
        this.operator = operator;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitPreExpr(this);
    }
}
export class Variable {
    constructor(name, pos) {
        this.name = name;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}
export class Assign {
    constructor(name, value, type, pos) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
}
export class Get {
    constructor(object, name, pos) {
        this.object = object;
        this.name = name;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitGetExpr(this);
    }
}
export class Set {
    constructor(object, name, value, type, pos) {
        this.object = object;
        this.name = name;
        this.value = value;
        this.type = type;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitSetExpr(this);
    }
}
export class Logical {
    constructor(left, operator, right, pos) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}
export class Par {
    constructor(id, value, pos) {
        this.id = id;
        this.value = value;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitObjectExpr(this);
    }
}
export class Obj {
    constructor(childs, pos) {
        this.childs = childs;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitObjectExpr(this);
    }
}
export class Array {
    constructor(childs, pos) {
        this.childs = childs;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitArrayExpr(this);
    }
}
export class Call {
    constructor(callee, paren, arg, pos) {
        this.callee = callee;
        this.paren = paren;
        this.arg = arg;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}
export class Ternary {
    constructor(condition, exprTrue, exprFalse, pos) {
        this.condition = condition;
        this.exprTrue = exprTrue;
        this.exprFalse = exprFalse;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitTernaryExpr(this);
    }
}
export class Super {
    constructor(keyword, method, pos) {
        this.keyword = keyword;
        this.method = method;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitSuperExpr(this);
    }
}
export class This {
    constructor(keyword, pos) {
        this.keyword = keyword;
        this.pos = pos;
        this.clss = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitThisExpr(this);
    }
}
//# sourceMappingURL=Expressions.js.map