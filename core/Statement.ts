
import * as Expr from "./Expressions.js";
import { Item } from "./Lexer.js";
import { Token } from "./Token.js";

export class Modifier {
  public mod: string;
  public value: string;

  constructor(mod: string, value: string) {
      this.mod = mod;
      this.value = value;
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
  abstract clssStmt:string;
}

export class Block implements Statement {
  public statements: Statement[];
  public clssStmt:string;

  constructor(statements: Statement[]) {
    this.statements = statements;

    this.clssStmt = this.constructor.name;
  }


  accept(visitor: Visitor) {
    return visitor.visitBlockStmt(this);
  }

}


export class Expression implements Statement {
  public expression;
  public mods:Modifier[];
  public clssStmt:string;


  constructor(expression, mods) {
    //console.log("Expression: ", expression);
    this.expression = expression;
    this.mods = mods;
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

  public clssStmt:string;

  constructor(condition: Expr.Expression, thenBranch: Statement, elseBranch: Statement) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;

    this.clssStmt = this.constructor.name;
  }

  accept(visitor: Visitor) {
    return visitor.visitIfStmt(this);
  }

}

export class Function implements Statement {
  public name;
  public params;
  public body;

  public clssStmt:string;

  constructor(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;

    this.clssStmt = this.constructor.name;
  }
  accept(visitor: Visitor) {
    return visitor.visitFunctionStmt(this);
  }
}

export class Var implements Statement {

  public name: Item;
  public initializer: Expr.Expression;

  public clssStmt:string;

  constructor(name: Item, initializer: Expr.Expression) {
    this.name = name;
    this.initializer = initializer;

    this.clssStmt = this.constructor.name;
  }

  accept(visitor: Visitor) {
    return visitor.visitVarStmt(this);
  }


}


export class Return implements Statement {

  public value: Expr.Expression;

  public clssStmt:string;

  constructor(value) {
    this.value = value;

    this.clssStmt = this.constructor.name;
  }
  accept(visitor: any) {
    return visitor.visitReturnStmt(this);
  }
}

export class While implements Statement {

  public condition: Expr.Expression;
  public body: Statement;

  public clssStmt:string;

  constructor(condition: Expr.Expression, body: Statement) {
    this.condition = condition;
    this.body = body;

    this.clssStmt = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitWhileStmt(this);
  }
}

export class Do implements Statement {

  public condition: Expr.Expression;
  public body: Statement;

  public clssStmt:string;

  constructor(condition: Expr.Expression, body: Statement) {
    this.condition = condition;
    this.body = body;

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

  public clssStmt:string;

  constructor(name: Item, superclass: Expr.Variable, methods: Function[]) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;

    this.clssStmt = this.constructor.name;
  }


  accept(visitor) {
    return visitor.visitClassStmt(this);
  }


}


export class Print implements Statement {
  public expression: Expr.Expression;

  public clssStmt:string;

  constructor(expression: Expr.Expression) {
    this.expression = expression;

    this.clssStmt = this.constructor.name;
  }

  accept(visitor) {
    return visitor.visitPrintStmt(this);
  }


}