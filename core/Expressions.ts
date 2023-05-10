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