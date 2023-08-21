import { Expression, Modifier } from "./Parser.js";
export declare class Outer {
    source: string;
    output: string;
    private data;
    indexOf: number;
    constructor();
    resetData(): void;
    setMap(token: string, data: object, pre: string): void;
    getDate(date: string | number | object | Date): Date;
    evalMods(data: string | number | object | Date, mods: Modifier[]): string;
    eval(expressions: Expression[]): string;
    execute(source: any): string;
}
