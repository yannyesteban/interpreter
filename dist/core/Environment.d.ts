import { Item } from "./Lexer.js";
export declare class Environment {
    enclosing: Environment;
    private values;
    constructor(enclosing?: any);
    get(name: Item): any;
    assign(name: Item, value: Object): void;
    define(name: string, value: Object): void;
    ancestor(distance: number): Environment;
    getAt(distance: number, name: string): any;
    assignAt(distance: number, name: Item, value: Object): void;
    toString(): string;
}
