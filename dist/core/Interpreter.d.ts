import { Item } from "./Lexer.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
import { Environment } from "./Environment.js";
import { FunctionR } from "./FunctionR.js";
export declare class Interpreter {
    private globals;
    private environment;
    locals: Map<any, any>;
    output: string[];
    constructor();
    interpret(statements: Stmt.Statement[]): string[];
    private evaluate;
    private execute;
    resolve(expr: Expr.Expression, depth: number): void;
    executeBlock(statements: Stmt.Statement[], environment: Environment): void;
    visitBlockStmt(stmt: Stmt.Block): any;
    visitClassStmt(stmt: Stmt.Class): any;
    visitExpressionStmt(stmt: Stmt.Expression): any;
    visitFunctionStmt(stmt: Stmt.Function): any;
    visitIfStmt(stmt: Stmt.If): any;
    visitPrintStmt(stmt: Stmt.Print): any;
    visitReturnStmt(stmt: Stmt.Return): void;
    visitVarStmt(stmt: Stmt.Var): any;
    visitWhileStmt(stmt: Stmt.While): any;
    visitAssignExpr(expr: Expr.Assign): Object;
    visitPostExpr(expr: Expr.PostAssign): any;
    visitPreExpr(expr: Expr.PreAssign): any;
    visitBinaryExpr(expr: Expr.Binary): string | number | boolean;
    visitCallExpr(expr: Expr.Call): any;
    visitGetExpr(expr: Expr.Get): any;
    visitGroupingExpr(expr: Expr.Grouping): any;
    visitLiteralExpr(expr: Expr.Literal): any;
    visitLogicalExpr(expr: Expr.Logical): any;
    visitSetExpr(expr: Expr.Set): Object;
    visitSuperExpr(expr: Expr.Super): FunctionR;
    visitThisExpr(expr: Expr.This): any;
    visitUnaryExpr(expr: Expr.Unary): number | boolean;
    visitVariableExpr(expr: Expr.Variable): any;
    visitObjectExpr(expr: Expr.Obj): {};
    visitArrayExpr(expr: Expr.Array): any[];
    visitTernaryExpr(expr: Expr.Ternary): any;
    lookUpVariable(name: Item, expr: Expr.Expression): any;
    private checkNumberOperand;
    private checkNumberOperands;
    private isTruthy;
    private isEqual;
    private stringify;
    getDate(date: string | number | object | Date): Date;
    evalMod(data: any, mod: Stmt.Modifier): any;
    evalMods(data: string | number | object | Date, mods: Stmt.Modifier[]): string;
}
