
import * as Expr from "./Expressions.js";
import { Item } from "./Lexer.js";
import { Token } from "./Token.js";

export interface Visitor {
  visitBlockStmt(stmt: Block);
  //visitClassStmt(Class stmt);
  visitExpressionStmt(stmt: Expression);
  visitFunctionStmt(stmt: Function);
  visitIfStmt(stmt: If);
  //visitPrintStmt(Print stmt);
  //visitReturnStmt(Return stmt);
  visitVarStmt(stmt: Var);
  //visitWhileStmt(While stmt);
}

export abstract class Statement {
  abstract accept(visitor: Visitor);
}

export class Block implements Statement {
  public statements: Statement[];
  constructor(statements: Statement[]) {
    this.statements = statements;
  }


  accept(visitor: Visitor) {
    return visitor.visitBlockStmt(this);
  }

}


export class Expression implements Statement {
  public expression;
  constructor(expression) {
    //console.log("Expression: ", expression);
    this.expression = expression;
  }
  accept(visitor: Visitor) {
    return visitor.visitExpressionStmt(this);
  }

}


export class If implements Statement {

  public condition;
  public thenBranch;
  public elseBranch;

  constructor(condition: Expr.Expression, thenBranch: Statement, elseBranch: Statement) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept(visitor: Visitor) {
    return visitor.visitIfStmt(this);
  }

}

export class Function implements Statement {
  public name;
  public params;
  public body;

  constructor(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
  }
  accept(visitor: Visitor) {
    return visitor.visitFunctionStmt(this);
  }
}

export class Var implements Statement {

  public name: Item;
  public initializer: Expr.Expression;
  constructor(name: Item, initializer: Expr.Expression) {
    this.name = name;
    this.initializer = initializer;
  }

  accept(visitor: Visitor) {
    return visitor.visitVarStmt(this);
  }


}


export class Return implements Statement {

  value: Expression;


  constructor(value) {
    this.value = value;
  }
  accept(visitor: any) {
    return visitor.visitReturnStmt(this);
  }
}

export class While implements Statement {

  public condition: Expr.Expression;
  public body: Statement;

  constructor(condition: Expr.Expression, body: Statement) {
    this.condition = condition;
    this.body = body;
  }

  accept(visitor) {
    return visitor.visitWhileStmt(this);
  }
}

export class Do implements Statement {

  public condition: Expr.Expression;
  public body: Statement;

  constructor(condition: Expr.Expression, body: Statement) {
    this.condition = condition;
    this.body = body;
  }

  accept(visitor) {
    return visitor.visitDoStmt(this);
  }
}


export class Class implements Statement {

  public name: Item;
  public superclass: Expr.Variable;
  public methods: Function[];

  constructor(name: Item, superclass: Expr.Variable, methods: Function[]) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }


  accept(visitor) {
    return visitor.visitClassStmt(this);
  }


}


export class Print implements Statement {
  public expression: Expr.Expression;
  constructor(expression: Expr.Expression) {
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitPrintStmt(this);
  }


}