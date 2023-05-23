import { InstanceR } from "./InstanceR.js";
var ClassR = /** @class */ (function () {
    function ClassR(name, superclass, methods) {
        this.superclass = superclass;
        this.name = name;
        this.methods = methods;
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
}());
export { ClassR };
//# sourceMappingURL=ClassR.js.map