import { Item } from "./Lexer";
export declare abstract class Expression {
    abstract accept(visitor: any): any;
    abstract clss: string;
    abstract pos: number;
}
export declare class Binary implements Expression {
    left: Expression;
    operator: Item;
    right: Expression;
    clss: string;
    pos: number;
    constructor(left: any, operator: any, right: any, pos: number);
    accept(visitor: any): any;
}
export declare class Literal implements Expression {
    value: any;
    type: number;
    clss: string;
    pos: number;
    constructor(value: any, pos?: number, type?: any);
    accept(visitor: any): any;
}
export declare class Unary implements Expression {
    operator: any;
    right: any;
    clss: string;
    pos: number;
    constructor(operator: any, right: any, pos: number);
    accept(visitor: any): any;
}
export declare class Grouping implements Expression {
    expression: any;
    clss: string;
    pos: number;
    constructor(expression: any, pos: number);
    accept(visitor: any): any;
}
export declare class PostAssign implements Expression {
    name: any;
    operator: Item;
    clss: string;
    pos: number;
    constructor(name: any, operator: Item, pos: number);
    accept(visitor: any): any;
}
export declare class PreAssign implements Expression {
    name: any;
    operator: Item;
    clss: string;
    pos: number;
    constructor(name: any, operator: Item, pos: number);
    accept(visitor: any): any;
}
export declare class Variable implements Expression {
    name: Item;
    clss: string;
    pos: number;
    constructor(name: Item, pos: number);
    accept(visitor: any): any;
}
export declare class Assign implements Expression {
    name: Item;
    value: Expression;
    type: Item;
    clss: string;
    pos: number;
    constructor(name: Item, value: Expression, type: Item, pos: number);
    accept(visitor: any): any;
}
export declare class Get implements Expression {
    name: Expression;
    object: Expression;
    clss: string;
    pos: number;
    constructor(object: Expression, name: Expression, pos: number);
    accept(visitor: any): any;
}
export declare class Set implements Expression {
    name: Expression;
    object: Expression;
    value: Expression;
    type: Item;
    clss: string;
    pos: number;
    constructor(object: Expression, name: Expression, value: Expression, type: Item, pos: number);
    accept(visitor: any): any;
}
export declare class Logical implements Expression {
    left: Expression;
    operator: Item;
    right: Expression;
    clss: string;
    pos: number;
    constructor(left: Expression, operator: Item, right: Expression, pos: number);
    accept(visitor: any): any;
}
export declare class Par implements Expression {
    id: Expression;
    value: Expression;
    clss: string;
    pos: number;
    constructor(id: any, value: any, pos: number);
    accept(visitor: any): any;
}
export declare class Obj implements Expression {
    childs: Par[];
    clss: string;
    pos: number;
    constructor(childs: any, pos: number);
    accept(visitor: any): any;
}
export declare class Array implements Expression {
    childs: Expression[];
    clss: string;
    pos: number;
    constructor(childs: any, pos: number);
    accept(visitor: any): any;
}
export declare class Call implements Expression {
    callee: Expression;
    paren: Item;
    arg: Expression[];
    childs: Expression[];
    clss: string;
    pos: number;
    constructor(callee: Expression, paren: Item, arg: Expression[], pos: number);
    accept(visitor: any): any;
}
export declare class Ternary implements Expression {
    condition: Expression;
    exprTrue: Expression;
    exprFalse: Expression;
    clss: string;
    pos: number;
    constructor(condition: Expression, exprTrue: Expression, exprFalse: Expression, pos: number);
    accept(visitor: any): any;
}
export declare class Super implements Expression {
    keyword: Item;
    method: Item;
    clss: string;
    pos: number;
    constructor(keyword: Item, method: Item, pos: number);
    accept(visitor: any): any;
}
export declare class This implements Expression {
    keyword: Item;
    clss: string;
    pos: number;
    constructor(keyword: Item, pos: number);
    accept(visitor: any): any;
}
