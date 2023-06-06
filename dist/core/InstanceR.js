var InstanceR = /** @class */ (function () {
    function InstanceR(klass) {
        this.fields = new Map();
        this.klass = klass;
    }
    InstanceR.prototype.get = function (name) {
        if (this.fields.has(name)) {
            return this.fields.get(name);
        }
        var method = this.klass.findMethod(name);
        if (method != null) {
            return method.bind(this);
        }
        throw "Undefined property '" + name + "'."; //new RuntimeError(name, "Undefined property '" + name.value + "'.");
    };
    InstanceR.prototype.set = function (name, value) {
        this.fields.set(name.value, value);
    };
    InstanceR.prototype.toString = function () {
        return this.klass.name + " instance";
    };
    return InstanceR;
}());
export { InstanceR };
//# sourceMappingURL=InstanceR.js.map