import * as exp from "constants";
import * as Expr from "./Expressions.js";


export interface Visitor {
    visitBlockStmt(stmt: Block);
    //visitClassStmt(Class stmt);
    visitExpressionStmt(stmt: Expression);
    visitFunctionStmt(stmt: Function);
    visitIfStmt(stmt: If);
    //visitPrintStmt(Print stmt);
    //visitReturnStmt(Return stmt);
    //visitVarStmt(Var stmt);
    //visitWhileStmt(While stmt);
  }

export interface Statement {
    accept(visitor: Visitor);
}

export class Block implements Statement {
    public statements: Statement[];
    constructor(statements: Statement[]) {
        this.statements = statements;
    }


    accept(visitor:Visitor) {
        return visitor.visitBlockStmt(this);
    }

}


export class Expression implements Statement {
    public expression;
    constructor(expression) {
        //console.log("Expression: ", expression);
        this.expression = expression;
    }
    accept(visitor:Visitor) {
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

    accept(visitor:Visitor) {
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
    accept(visitor:Visitor) {
        return visitor.visitFunctionStmt(this);
    }

    
  }