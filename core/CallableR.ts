import { Interpreter } from "./Interpreter.js";

export abstract class CallableR {
    abstract arity(): number;
    abstract call(interpreter: Interpreter, _arguments: Object[]): Object;
}
