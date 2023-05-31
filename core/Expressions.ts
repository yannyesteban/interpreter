import { Item } from "./Lexer";
import { Visitor } from "./Statement";
/*
export interface Expression {
  accept(visitor: any);
}
*/
export abstract class Expression {
  abstract accept(visitor: any);
  abstract clss: string;
}

export class Binary implements Expression {
  public left: Expression;
  public operator: Item;
  public right: Expression;
  public clss: string;

  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

export class Literal implements Expression {
  public value = null;
  public type: number = 0;
  public clss: string;
  constructor(value, type?) {
    this.value = value;
    this.type = type;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

export class Unary implements Expression {
  public operator;
  public right;
  public clss: string;
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

export class Grouping implements Expression {
  public expression;
  public clss: string;
  constructor(expression) {
    this.expression = expression;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

export class PostAssign implements Expression {
  public name;
  public operator;
  public clss: string;

  constructor(name, operator) {
    this.name = name;
    this.operator = operator;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPostExpr(this);
  }
}

export class PreAssign implements Expression {
  public name;
  public operator;
  public clss: string;

  constructor(name, operator) {
    this.name = name;
    this.operator = operator;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPreExpr(this);
  }
}

export class Variable implements Expression {
  public name: Item;
  public clss: string;

  constructor(name: Item) {
    this.name = name;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitVariableExpr(this);
  }
}

export class Assign implements Expression {

  public name: Item;
  public value: Expression;
  public type: Item;
  public clss: string;

  constructor(name: Item, value: Expression, type: Item) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitAssignExpr(this);
  }
}



export class Get implements Expression {
  public name: Item;
  public object: Expression;
  public clss: string;

  constructor(object: Expression, name: Item) {
    this.object = object;
    this.name = name;
    this.clss = this.constructor.name;
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
  public clss: string;

  constructor(object: Expression, name: Item, value: Expression, type: Item) {
    this.object = object;
    this.name = name;
    this.value = value;
    this.type = type;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitSetExpr(this);
  }
}

export class Get2 implements Expression {
  public name: Expression;
  public object: Expression;
  public clss: string;

  constructor(object: Expression, name: Expression) {
    this.object = object;
    this.name = name;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitGet2Expr(this);
  }
}

export class Set2 implements Expression {

  public name: Expression;
  public object: Expression;
  public value: Expression;
  public type: Item;
  public clss: string;

  constructor(object: Expression, name: Expression, value: Expression, type: Item) {
    this.object = object;
    this.name = name;
    this.value = value;
    this.type = type;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitSet2Expr(this);
  }
}

export class Logical implements Expression {

  public left: Expression;
  public operator: Item;

  public right: Expression;
  public clss: string;

  constructor(left: Expression, operator: Item, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitLogicalExpr(this);
  }
}


export class Par implements Expression {
  public id: Expression;
  public value: Expression;
  public clss: string;

  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Object implements Expression {

  public childs: Par[];
  public clss: string;

  constructor(childs) {
    this.childs = childs;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Array implements Expression {

  public childs: Expression[];
  public clss: string;

  constructor(childs) {
    this.childs = childs;
    this.clss = this.constructor.name;
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
  public clss: string;


  constructor(callee: Expression, paren: Item, arg: Expression[]) {
    this.callee = callee;
    this.paren = paren;
    this.arg = arg;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitCallExpr(this);
  }
}

export class Ternary implements Expression {

  public cond: Expression;
  public exprTrue: Expression;
  public exprFalse: Expression;
  public clss: string;


  constructor(cond: Expression, exprTrue: Expression, exprFalse: Expression) {
    this.cond = cond;
    this.exprTrue = exprTrue;
    this.exprFalse = exprFalse;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitTernaryExpr(this);
  }
}

export class Super implements Expression {
  public keyword: Item;
  public method: Item;
  public clss: string;

  constructor(keyword: Item, method: Item) {
    this.keyword = keyword;
    this.method = method;
    this.clss = this.constructor.name;
  }


  accept(visitor) {
    return visitor.visitSuperExpr(this);
  }

}

export class This implements Expression {
  public keyword: Item;
  public clss: string;

  constructor(keyword: Item) {
    this.keyword = keyword;
    this.clss = this.constructor.name;
  }


  accept(visitor) {
    return visitor.visitThisExpr(this);
  }


}