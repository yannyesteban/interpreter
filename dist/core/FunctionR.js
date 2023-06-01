var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CallableR } from "./CallableR.js";
import { Environment } from "./Environment.js";
var FunctionR = /** @class */ (function (_super) {
    __extends(FunctionR, _super);
    function FunctionR(declaration, closure, isInitializer) {
        var _this = _super.call(this) || this;
        _this.isInitializer = isInitializer;
        _this.closure = closure;
        _this.declaration = declaration;
        return _this;
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
        console.log("calculate arity ", this.declaration.params, this.declaration.params.length);
        return this.declaration.params.length;
    };
    FunctionR.prototype.call = function (interpreter, _arguments) {
        var environment = new Environment(this.closure);
        for (var i = 0; i < this.declaration.params.length; i++) {
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
    };
    return FunctionR;
}(CallableR));
export { FunctionR };
//# sourceMappingURL=FunctionR.js.map