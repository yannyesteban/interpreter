import { ClassR } from "./ClassR";
import { Item } from "./Lexer";
export declare class InstanceR {
    private klass;
    private fields;
    constructor(klass: ClassR);
    get(name: string): any;
    set(name: Item, value: Object): void;
    toString(): string;
}
