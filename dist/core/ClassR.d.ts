import { CallableR } from "./CallableR.js";
import { FunctionR } from "./FunctionR.js";
import { InstanceR } from "./InstanceR.js";
import { Interpreter } from "./Interpreter.js";
export declare class ClassR extends CallableR {
    name: string;
    superclass: ClassR;
    private methods;
    constructor(name: string, superclass: ClassR, methods: Map<string, FunctionR>);
    findMethod(name: string): FunctionR;
    toString(): string;
    call(interpreter: Interpreter, _arguments: Object[]): InstanceR;
    arity(): number;
}
