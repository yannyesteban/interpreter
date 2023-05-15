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

  constructor(name: Item, value: Expression) {
    this.name = name;
    this.value = value;
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
  constructor(object: Expression, name: Item, value: Expression) {
    this.object = object;
    this.name = name;
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitSetExpr(this);
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

  childs:Par[];
  
  
  constructor(childs) {
    this.childs = childs;
  }
  accept(visitor: any) {
    return visitor.visitObjectExpr(this);
  }
}

export class Array implements Expression {

  childs:Expression[];
  
  
  constructor(childs) {
    this.childs = childs;
  }
  accept(visitor: any) {
    return visitor.visitArrayExpr(this);
  }
}