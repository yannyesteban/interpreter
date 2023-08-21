import { Token } from "../Token.js";
import { Item } from "../Lexer.js";
export declare enum ExpressionType {
    VAR = 1,
    DATE = 2,
    TIME = 3
}
export declare class Expression {
    token: string;
    name: string;
    pos: number;
    length: number;
    mods: Modifier[];
    ready: boolean;
    path: string[];
    type: ExpressionType;
    outside: boolean;
    constructor(token: string, name: string, pos: number, length: number, mods: Modifier[], path: any, type: ExpressionType, outside: boolean);
}
export declare class Modifier {
    mod: string;
    value: string;
    constructor(mod: string, value: string);
}
export declare class Parser {
    version: string;
    tokens: Item[];
    current: number;
    brackets: number;
    constructor();
    error(token: any, message: any): void;
    parse(tokens: Item[]): Expression;
    peek(): Item;
    isAtEnd(): boolean;
    isEOL(): boolean;
    reset(position: any): void;
    getPosition(): number;
    advance(): Item;
    previous(): Item;
    consume(type: any, message: any): Item;
    check(TokenType: Token): boolean;
    match(...TokenType: Token[]): boolean;
    expression(): Expression;
    modifiers(): Modifier[];
}
