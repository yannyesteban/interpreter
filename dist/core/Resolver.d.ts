import { Interpreter } from "./Interpreter.js";
import * as Expr from "./Expressions.js";
import * as Stmt from "./Statement.js";
export declare enum FunctionType {
    NONE = 0,
    FUNCTION = 1,
    INITIALIZER = 2,
    METHOD = 3
}
export declare enum ClassType {
    NONE = 0,
    CLASS = 1,
    SUBCLASS = 2
}
export declare class Resolver {
    private interpreter;
    private scopes;
    private currentFunction;
    constructor(interpreter: Interpreter);
    private currentClass;
    resolve(s: Stmt.Statement[] | Stmt.Statement | Expr.Expression | Stmt.Expression | any): void;
    visitBlockStmt(stmt: Stmt.Block): any;
    visitClassStmt(stmt: Stmt.Class): any;
    visitExpressionStmt(stmt: Stmt.Expression): any;
    visitFunctionStmt(stmt: Stmt.Function): any;
    visitIfStmt(stmt: Stmt.If): any;
    visitPrintStmt(stmt: Stmt.Print): any;
    visitReturnStmt(stmt: Stmt.Return): any;
    visitVarStmt(stmt: Stmt.Var): any;
    visitWhileStmt(stmt: Stmt.While): any;
    visitAssignExpr(expr: Expr.Assign): any;
    visitBinaryExpr(expr: Expr.Binary): any;
    visitCallExpr(expr: Expr.Call): any;
    visitGetExpr(expr: Expr.Get): any;
    visitGroupingExpr(expr: Expr.Grouping): any;
    visitLiteralExpr(expr: Expr.Literal): any;
    visitLogicalExpr(expr: Expr.Logical): any;
    visitSetExpr(expr: Expr.Set): any;
    visitSuperExpr(expr: Expr.Super): any;
    visitThisExpr(expr: Expr.This): any;
    visitUnaryExpr(expr: Expr.Unary): any;
    visitVariableExpr(expr: Expr.Variable): any;
    visitObjectExpr(expr: Expr.Obj): void;
    visitPreExpr(expr: Expr.PreAssign): void;
    visitPostExpr(expr: Expr.PostAssign): void;
    visitArrayExpr(expr: Expr.Array): void;
    visitTernaryExpr(expr: Expr.Ternary): void;
    private resolveFunction;
    private beginScope;
    private endScope;
    private declare;
    private define;
    private resolveLocal;
}
