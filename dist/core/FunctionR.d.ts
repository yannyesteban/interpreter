import { CallableR } from "./CallableR.js";
import { Environment } from "./Environment.js";
import { InstanceR } from "./InstanceR.js";
import { Interpreter } from "./Interpreter.js";
import * as Stmt from "./Statement.js";
export declare class FunctionR extends CallableR {
    private declaration;
    private closure;
    private isInitializer;
    constructor(declaration: Stmt.Function, closure: Environment, isInitializer: boolean);
    bind(instance: InstanceR): FunctionR;
    toString(): string;
    arity(): number;
    call(interpreter: Interpreter, _arguments: Object[]): any;
}
