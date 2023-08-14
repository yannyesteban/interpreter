export class Modifier {
    constructor(name, param) {
        this.name = name;
        this.param = param;
    }
}
export class Statement {
}
export class Block {
    constructor(statements, pos) {
        this.statements = statements;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}
export class Expression {
    constructor(expression, mods, pos) {
        //console.log("Expression: ", expression);
        this.expression = expression;
        this.mods = mods;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
export class If {
    constructor(condition, thenBranch, elseBranch, pos) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}
export class Function {
    constructor(name, params, body, pos) {
        this.name = name;
        this.params = params;
        this.body = body;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}
export class Var {
    constructor(name, initializer, pos) {
        this.name = name;
        this.initializer = initializer;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}
export class Return {
    constructor(value, pos) {
        this.value = value;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitReturnStmt(this);
    }
}
export class While {
    constructor(condition, body, pos) {
        this.condition = condition;
        this.body = body;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitWhileStmt(this);
    }
}
export class Do {
    constructor(condition, body, pos) {
        this.condition = condition;
        this.body = body;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitDoStmt(this);
    }
}
export class Class {
    constructor(name, superclass, methods, pos) {
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitClassStmt(this);
    }
}
export class Print {
    constructor(expression, pos) {
        this.expression = expression;
        this.pos = pos;
        this.clssStmt = this.constructor.name;
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}
//# sourceMappingURL=Statement.js.map