import { Environment } from "./Environment.js";
var FunctionR = /** @class */ (function () {
    function FunctionR(declaration, closure, isInitializer) {
        this.isInitializer = isInitializer;
        this.closure = closure;
        this.declaration = declaration;
    }
    FunctionR.prototype.bind = function (instance) {
        var environment = new Environment(this.closure);
        environment.define("this", instance);
        return new FunctionR(this.declaration, environment, this.isInitializer);
    };
    FunctionR.prototype.toString = function () {
        return "<fn " + this.declaration.name.value + ">";
    };
    FunctionR.prototype.arity = function () {
        return this.declaration.params.size();
    };
    FunctionR.prototype.call = function (interpreter, _arguments) {
        var environment = new Environment(this.closure);
        for (var i = 0; i < this.declaration.params.size(); i++) {
            environment.define(this.declaration.params.get(i).lexeme, _arguments[i]);
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
    };
    return FunctionR;
}());
export { FunctionR };
//# sourceMappingURL=FunctionR.js.map