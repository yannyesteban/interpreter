import { Item } from "./Lexer";
import { Visitor } from "./Statement";

export interface Expression {
  accept(visitor: any);
}

export class Binary {
  public left;
  public operator;
  public right;

  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

export class Literal {
  public value = null;
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

export class Unary {
  public operator;
  public right;
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

export class Grouping {
  public expression;
  constructor(expression) {
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

export class PostAssign {
  public name;
  public operator;

  constructor(name, operator) {
    this.name = name;
    this.operator = operator;
  }

  accept(visitor) {
    return visitor.visitPostExpr(this);
  }
}

export class PreAssign {
  public name;
  public operator;

  constructor(name, operator) {
    this.name = name;
    this.operator = operator;
  }

  accept(visitor) {
    return visitor.visitPreExpr(this);
  }
}

export class Variable implements Expression {
  public name: Item;

  constructor(name: Item) {
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitVariableExpr(this);
  }
}

export class Assign implements Expression {

  public name: Item;
  public value: Expression;
  public type: Item;

  constructor(name: Item, value: Expression, type: Item) {
    this.name = name;
    this.value = value;
    this.type = type;
  }

  accept(visitor) {
    return visitor.visitAssignExpr(this);
  }
}



export class Get implements Expression {
  public name: Item;
  public object: Expression;

  constructor(object: Expression, name: Item) {
    this.object = object;
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitGetExpr(this);
  }
}

export class Set implements Expression {

  public name: Item;
  public object: Expression;
  public value: Expression;
  public type: Item;

  constructor(object: Expression, name: Item, value: Expression, type: Item) {
    this.object = object;
    this.name = name;
    this.value = value;
    this.type = type;
  }

  accept(visitor) {
    return visitor.visitSetExpr(this);
  }
}

export class Get2 implements Expression {
  public name: Expression;
  public object: Expression;

  constructor(object: Expression, name: Expression) {
    this.object = object;
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitGet2Expr(this);
  }
}

export class Logical implements Expression {

  public left: Expression;
  public operator: Item;

  public right: Expression;

  constructor(left: Expression, operator: Item, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitLogicalExpr(this);
  }
}


export class Par implements Expression {
  public id: Item;
  public value: Expression;
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Object implements Expression {

  childs: Par[];


  constructor(childs) {
    this.childs = childs;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Array implements Expression {

  childs: Expression[];


  constructor(childs) {
    this.childs = childs;
  }
  accept(visitor: any) {
    return visitor.visitArrayExpr(this);
  }
}

export class Call implements Expression {

  public callee: Expression;
  public paren: Item;
  public arg: Expression[];

  childs: Expression[];


  constructor(callee: Expression, paren: Item, arg: Expression[]) {
    this.callee = callee;
    this.paren = paren;
    this.arg = arg;
  }
  accept(visitor: any) {
    return visitor.visitCallExpr(this);
  }
}

export class Ternary implements Expression {

  public cond: Expression;
  public exprTrue: Expression;
  public exprFalse: Expression;


  constructor(cond: Expression, exprTrue: Expression, exprFalse: Expression) {
    this.cond = cond;
    this.exprTrue = exprTrue;
    this.exprFalse = exprFalse;
  }

  accept(visitor) {
    return visitor.visitTernaryExpr(this);
  }
}

export class Super implements Expression {
  public keyword: Item;
  public method: Item;

  constructor(keyword: Item, method: Item) {
    this.keyword = keyword;
    this.method = method;
  }


  accept(visitor) {
    return visitor.visitSuperExpr(this);
  }

}

export class This implements Expression {
  public keyword: Item;
  constructor(keyword: Item) {
    this.keyword = keyword;
  }


  accept(visitor) {
    return visitor.visitThisExpr(this);
  }


}