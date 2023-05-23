import { CallableR } from "./CallableR.js";
import { Environment } from "./Environment.js";
import * as Expr from "./Expressions.js";
import { InstanceR } from "./InstanceR.js";
import { Interpreter } from "./Interpreter.js";
import { ReturnR } from "./ReturnR.js";
import * as Stmt from "./Statement.js";


export class FunctionR implements CallableR {
    
    private declaration: Stmt.Function;
    private closure: Environment;
    private isInitializer: boolean;

    constructor(declaration: Stmt.Function, closure: Environment, isInitializer: boolean) {
        this.isInitializer = isInitializer;
        this.closure = closure;
        this.declaration = declaration;
    }

    bind(instance: InstanceR) {
        const environment: Environment = new Environment(this.closure);
        environment.define("this", instance);
        return new FunctionR(this.declaration, environment, this.isInitializer);
    }

    toString() {
        return "<fn " + this.declaration.name.value + ">";
    }

    arity() {
        return this.declaration.params.size();
    }

    call(interpreter: Interpreter, _arguments: Object[]) {

        const environment: Environment = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.size(); i++) {
            environment.define(this.declaration.params.get(i).lexeme, _arguments[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (returnValue) {

            if (this.isInitializer) {
                return this.closure.getAt(0, "this");
            }

            return returnValue.value;
        }

        if (this.isInitializer) {
            return this.closure.getAt(0, "this");
        }
        return null;
    }
}
