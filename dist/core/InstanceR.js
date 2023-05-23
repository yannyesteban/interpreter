var InstanceR = /** @class */ (function () {
    function InstanceR(klass) {
        this.fields = new Map();
        this.klass = klass;
    }
    InstanceR.prototype.get = function (name) {
        if (this.fields.has(name.value)) {
            return this.fields.get(name.value);
        }
        var method = this.klass.findMethod(name.value);
        if (method != null) {
            return method.bind(this);
        }
        throw ""; //new RuntimeError(name, "Undefined property '" + name.value + "'.");
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