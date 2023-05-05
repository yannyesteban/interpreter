import * as exp from "constants";
import * as Expr from "./Expressions.js";

export interface Statement {
    accept(visitor: any);
}

export class Block implements Statement {
    public statements: Statement[];
    constructor(statements) {
        this.statements = statements;
    }


    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }

}


export class Expression implements Statement {
    public expression;
    constructor(expression) {
        console.log("Expression: ", expression);
        this.expression = expression;
    }
    accept(visitor) {
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

    accept(visitor) {
        return visitor.visitIfStmt(this);
    }

}  