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
  abstract pos: number;
}

export class Binary implements Expression {
  public left: Expression;
  public operator: Item;
  public right: Expression;
  public clss: string;
  public pos: number;

  constructor(left, operator, right, pos: number) {
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

export class Literal implements Expression {
  public value = null;
  public type: number = 0;
  public clss: string;
  public pos: number;

  constructor(value, pos?: number, type?) {
    this.value = value;
    this.type = type;
    this.pos = pos;
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
  public pos: number;

  constructor(operator, right, pos: number) {
    this.operator = operator;
    this.right = right;
    this.pos = pos;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

export class Grouping implements Expression {
  public expression;
  public clss: string;
  public pos: number;

  constructor(expression, pos: number) {
    this.expression = expression;
    this.pos = pos;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

export class PostAssign implements Expression {
  public name;
  public operator: Item;
  public clss: string;
  public pos: number;

  constructor(name, operator: Item, pos: number) {
    this.name = name;
    this.operator = operator;
    this.pos = pos;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPostExpr(this);
  }
}

export class PreAssign implements Expression {
  public name;
  public operator: Item;
  public clss: string;
  public pos: number;

  constructor(name, operator: Item, pos: number) {
    this.name = name;
    this.operator = operator;
    this.pos = pos;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPreExpr(this);
  }
}

export class Variable implements Expression {
  public name: Item;
  public clss: string;
  public pos: number;

  constructor(name: Item, pos: number) {
    this.name = name;
    this.pos = pos;
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
  public pos: number;

  constructor(name: Item, value: Expression, type: Item, pos: number) {
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



export class Get implements Expression {
  public name: Expression;
  public object: Expression;
  public clss: string;
  public pos: number;

  constructor(object: Expression, name: Expression, pos: number) {
    this.object = object;
    this.name = name;
    this.pos = pos;
    this.clss = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitGetExpr(this);
  }
}

export class Set implements Expression {

  public name: Expression;
  public object: Expression;
  public value: Expression;
  public type: Item;
  public clss: string;
  public pos: number;

  constructor(object: Expression, name: Expression, value: Expression, type: Item, pos: number) {
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





export class Logical implements Expression {

  public left: Expression;
  public operator: Item;

  public right: Expression;
  public clss: string;
  public pos: number;

  constructor(left: Expression, operator: Item, right: Expression, pos: number) {
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


export class Par implements Expression {
  public id: Expression;
  public value: Expression;
  public clss: string;
  public pos: number;

  constructor(id, value, pos: number) {
    this.id = id;
    this.value = value;
    this.pos = pos;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Obj implements Expression {

  public childs: Par[];
  public clss: string;
  public pos: number;

  constructor(childs, pos: number) {
    this.childs = childs;
    this.pos = pos;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Array implements Expression {

  public childs: Expression[];
  public clss: string;
  public pos: number;

  constructor(childs, pos: number) {
    this.childs = childs;
    this.pos = pos;
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
  public pos: number;


  constructor(callee: Expression, paren: Item, arg: Expression[], pos: number) {
    this.callee = callee;
    this.paren = paren;
    this.arg = arg;
    this.pos = pos;
    this.clss = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitCallExpr(this);
  }
}

export class Ternary implements Expression {

  public condition: Expression;
  public exprTrue: Expression;
  public exprFalse: Expression;
  public clss: string;
  public pos: number;


  constructor(condition: Expression, exprTrue: Expression, exprFalse: Expression, pos: number) {
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

export class Super implements Expression {
  public keyword: Item;
  public method: Item;
  public clss: string;
  public pos: number;

  constructor(keyword: Item, method: Item, pos: number) {
    this.keyword = keyword;
    this.method = method;
    this.pos = pos;
    this.clss = this.constructor.name;
  }


  accept(visitor) {
    return visitor.visitSuperExpr(this);
  }

}

export class This implements Expression {
  public keyword: Item;
  public clss: string;
  public pos: number;

  constructor(keyword: Item, pos: number) {
    this.keyword = keyword;
    this.pos = pos;
    this.clss = this.constructor.name;
  }


  accept(visitor) {
    return visitor.visitThisExpr(this);
  }


}