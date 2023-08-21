import { Native } from "./Native.js";
export declare class NavMath extends Native {
    private fields;
    arity(): number;
    get(name: string): any;
    eval(method: string, args: Object[]): number;
    toString(): string;
}
