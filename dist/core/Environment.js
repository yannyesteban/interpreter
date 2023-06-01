var Environment = /** @class */ (function () {
    function Environment(enclosing) {
        this.values = {};
        if (enclosing !== undefined) {
            this.enclosing = enclosing;
        }
        else {
            this.enclosing = null;
        }
    }
    Environment.prototype.get = function (name) {
        if (name.value in this.values) {
            return this.values[name.value];
        }
        if (this.enclosing != null) {
            return this.enclosing.get(name);
        }
        console.log("Undefined variable '" + name.value + "'.");
        throw ""; //new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    };
    Environment.prototype.assign = function (name, value) {
        if (name.value in this.values) {
            this.values[name.value] = value;
            return;
        }
        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }
        throw ""; //new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    };
    Environment.prototype.define = function (name, value) {
        this.values[name] = value;
    };
    Environment.prototype.ancestor = function (distance) {
        var environment = this;
        for (var i = 0; i < distance; i++) {
            environment = environment.enclosing; // [coupled]
        }
        return environment;
    };
    Environment.prototype.getAt = function (distance, name) {
        return this.ancestor(distance).values[name];
    };
    Environment.prototype.assignAt = function (distance, name, value) {
        this.ancestor(distance).values[name.value] = value;
    };
    Environment.prototype.toString = function () {
        var result = this.values.toString();
        if (this.enclosing != null) {
            result += " -> " + this.enclosing.toString();
        }
        return result;
    };
    return Environment;
}());
export { Environment };
//# sourceMappingURL=Environment.js.map