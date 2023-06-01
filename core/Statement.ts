
import * as Expr from "./Expressions.js";
import { Item } from "./Lexer.js";
import { Token } from "./Token.js";

export class Modifier {
  public name: string;
  public param: Expr.Expression;

  constructor(name: string, param: Expr.Expression) {
    this.name = name;
    this.param = param;
  }
}

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
  abstract pos: number;
  abstract clssStmt: string;
}

export class Block implements Statement {
  public statements: Statement[];
  public pos: number;
  public clssStmt: string;

  constructor(statements: Statement[], pos: number) {
    this.statements = statements;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }


  accept(visitor: Visitor) {
    return visitor.visitBlockStmt(this);
  }

}


export class Expression implements Statement {
  public expression;
  public mods: Modifier[];
  public pos: number;
  public clssStmt: string;


  constructor(expression, mods, pos: number) {
    //console.log("Expression: ", expression);
    this.expression = expression;
    this.mods = mods;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }
  accept(visitor: Visitor) {
    return visitor.visitExpressionStmt(this);
  }

}


export class If implements Statement {

  public condition;
  public thenBranch;
  public elseBranch;
  public pos: number;
  public clssStmt: string;

  constructor(condition: Expr.Expression, thenBranch: Statement, elseBranch: Statement, pos: number) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }

  accept(visitor: Visitor) {
    return visitor.visitIfStmt(this);
  }

}

export class Function implements Statement {
  public name: Item;
  public params: Item[];
  public body: Statement[];
  public pos: number;
  public clssStmt: string;

  constructor(name: Item, params: Item[], body: Statement[], pos: number) {
    this.name = name;
    this.params = params;
    this.body = body;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }
  accept(visitor: Visitor) {
    return visitor.visitFunctionStmt(this);
  }
}

export class Var implements Statement {

  public name: Item;
  public initializer: Expr.Expression;
  public pos: number;
  public clssStmt: string;

  constructor(name: Item, initializer: Expr.Expression, pos: number) {
    this.name = name;
    this.initializer = initializer;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }

  accept(visitor: Visitor) {
    return visitor.visitVarStmt(this);
  }


}


export class Return implements Statement {

  public value: Expr.Expression;
  public pos: number;
  public clssStmt: string;

  constructor(value, pos: number) {
    this.value = value;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitReturnStmt(this);
  }
}

export class While implements Statement {

  public condition: Expr.Expression;
  public body: Statement;
  public pos: number;
  public clssStmt: string;

  constructor(condition: Expr.Expression, body: Statement, pos: number) {
    this.condition = condition;
    this.body = body;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitWhileStmt(this);
  }
}

export class Do implements Statement {

  public condition: Expr.Expression;
  public body: Statement;
  public pos: number;
  public clssStmt: string;

  constructor(condition: Expr.Expression, body: Statement, pos: number) {
    this.condition = condition;
    this.body = body;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitDoStmt(this);
  }
}


export class Class implements Statement {

  public name: Item;
  public superclass: Expr.Variable;
  public methods: Function[];
  public pos: number;
  public clssStmt: string;

  constructor(name: Item, superclass: Expr.Variable, methods: Function[], pos: number) {
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


export class Print implements Statement {
  public expression: Expr.Expression;
  public pos: number;
  public clssStmt: string;

  constructor(expression: Expr.Expression, pos: number) {
    this.expression = expression;
    this.pos = pos;
    this.clssStmt = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPrintStmt(this);
  }


}