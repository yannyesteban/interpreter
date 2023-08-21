import * as Expr from "./Expressions.js";
import { Item } from "./Lexer.js";
export declare class Modifier {
    name: string;
    param: Expr.Expression;
    constructor(name: string, param: Expr.Expression);
}
export interface Visitor {
    visitBlockStmt(stmt: Block): any;
    visitExpressionStmt(stmt: Expression): any;
    visitFunctionStmt(stmt: Function): any;
    visitIfStmt(stmt: If): any;
    visitVarStmt(stmt: Var): any;
}
export declare abstract class Statement {
    abstract accept(visitor: Visitor): any;
    abstract pos: number;
    abstract clssStmt: string;
}
export declare class Block implements Statement {
    statements: Statement[];
    pos: number;
    clssStmt: string;
    constructor(statements: Statement[], pos: number);
    accept(visitor: Visitor): any;
}
export declare class Expression implements Statement {
    expression: any;
    mods: Modifier[];
    pos: number;
    clssStmt: string;
    constructor(expression: any, mods: any, pos: number);
    accept(visitor: Visitor): any;
}
export declare class If implements Statement {
    condition: any;
    thenBranch: any;
    elseBranch: any;
    pos: number;
    clssStmt: string;
    constructor(condition: Expr.Expression, thenBranch: Statement, elseBranch: Statement, pos: number);
    accept(visitor: Visitor): any;
}
export declare class Function implements Statement {
    name: Item;
    params: Item[];
    body: Statement[];
    pos: number;
    clssStmt: string;
    constructor(name: Item, params: Item[], body: Statement[], pos: number);
    accept(visitor: Visitor): any;
}
export declare class Var implements Statement {
    name: Item;
    initializer: Expr.Expression;
    pos: number;
    clssStmt: string;
    constructor(name: Item, initializer: Expr.Expression, pos: number);
    accept(visitor: Visitor): any;
}
export declare class Return implements Statement {
    value: Expr.Expression;
    pos: number;
    clssStmt: string;
    constructor(value: any, pos: number);
    accept(visitor: any): any;
}
export declare class While implements Statement {
    condition: Expr.Expression;
    body: Statement;
    pos: number;
    clssStmt: string;
    constructor(condition: Expr.Expression, body: Statement, pos: number);
    accept(visitor: any): any;
}
export declare class Do implements Statement {
    condition: Expr.Expression;
    body: Statement;
    pos: number;
    clssStmt: string;
    constructor(condition: Expr.Expression, body: Statement, pos: number);
    accept(visitor: any): any;
}
export declare class Class implements Statement {
    name: Item;
    superclass: Expr.Variable;
    methods: Function[];
    pos: number;
    clssStmt: string;
    constructor(name: Item, superclass: Expr.Variable, methods: Function[], pos: number);
    accept(visitor: any): any;
}
export declare class Print implements Statement {
    expression: Expr.Expression;
    pos: number;
    clssStmt: string;
    constructor(expression: Expr.Expression, pos: number);
    accept(visitor: any): any;
}
