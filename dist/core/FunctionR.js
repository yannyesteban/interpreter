import { CallableR } from "./CallableR.js";
import { Environment } from "./Environment.js";
export class FunctionR extends CallableR {
    constructor(declaration, closure, isInitializer) {
        super();
        this.isInitializer = isInitializer;
        this.closure = closure;
        this.declaration = declaration;
    }
    bind(instance) {
        const environment = new Environment(this.closure);
        environment.define("this", instance);
        return new FunctionR(this.declaration, environment, this.isInitializer);
    }
    toString() {
        return "<fn " + this.declaration.name.value + ">";
    }
    arity() {
        console.log("calculate arity ", this.declaration.params, this.declaration.params.length);
        return this.declaration.params.length;
    }
    call(interpreter, _arguments) {
        const environment = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].value, _arguments[i]);
        }
        try {
            interpreter.executeBlock(this.declaration.body, environment);
        }
        catch (returnValue) {
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
//# sourceMappingURL=FunctionR.js.map