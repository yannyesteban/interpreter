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
import { InstanceR } from "./InstanceR.js";
var ClassR = /** @class */ (function (_super) {
    __extends(ClassR, _super);
    function ClassR(name, superclass, methods) {
        var _this = _super.call(this) || this;
        _this.superclass = superclass;
        _this.name = name;
        _this.methods = methods;
        return _this;
    }
    ClassR.prototype.findMethod = function (name) {
        if (this.methods.has(name)) {
            return this.methods.get(name);
        }
        if (this.superclass != null) {
            return this.superclass.findMethod(name);
        }
        return null;
    };
    ClassR.prototype.toString = function () {
        return this.name;
    };
    ClassR.prototype.call = function (interpreter, _arguments) {
        var instance = new InstanceR(this);
        var initializer = this.findMethod("init");
        if (initializer != null) {
            initializer.bind(instance).call(interpreter, _arguments);
        }
        return instance;
    };
    ClassR.prototype.arity = function () {
        var initializer = this.findMethod("init");
        if (initializer == null) {
            return 0;
        }
        return initializer.arity();
    };
    return ClassR;
}(CallableR));
export { ClassR };
//# sourceMappingURL=ClassR.js.map