import { Token } from "./Token.js";
export declare class Section {
    tokens: Item[];
    pos: number;
    length: number;
    outside: boolean;
    output: any;
    constructor(tokens: Item[], pos: number, length: number, outside: boolean);
}
export interface Item {
    pos: number;
    value: any;
    priority: number;
    tok: string | Token.EOF | number;
}
export declare class Lexer {
    input: string;
    pos: number;
    rd: number;
    eof: boolean;
    ch: string;
    private markEOL;
    constructor(input: string, useString?: boolean);
    error(offs: number, msg: string): void;
    evalOp(ch: any, tokenDefault: any, tokenAssign: any, tokenX2: any, tokenX3: any): any;
    doubleOp(ch: any, tokenDefault: any, tokenX2: any): any;
    skipWhitespace(): void;
    digitVal(ch: string): number;
    scanEscape(quote: any): boolean;
    scanString(quote: any): string;
    scanIdentifier(): string;
    scanNumber(): {
        lit: string;
        tok: Token.INT | Token.FLOAT;
    };
    digits(base: number): void;
    scan(): Item;
    next(): void;
    setPosition(pos: number): void;
    peek(): string;
    getTokens(): any[];
    getSections(leftDelim: string, rightDelim: string): Section[];
}
