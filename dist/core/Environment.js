export class Environment {
    constructor(enclosing) {
        this.values = {};
        if (enclosing !== undefined) {
            this.enclosing = enclosing;
        }
        else {
            this.enclosing = null;
        }
    }
    get(name) {
        if (name.value in this.values) {
            return this.values[name.value];
        }
        if (this.enclosing != null) {
            return this.enclosing.get(name);
        }
        console.log("Undefined variable '" + name.value + "'.");
        throw ""; //new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    assign(name, value) {
        if (name.value in this.values) {
            this.values[name.value] = value;
            return;
        }
        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }
        throw ""; //new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    define(name, value) {
        this.values[name] = value;
    }
    ancestor(distance) {
        let environment = this;
        for (let i = 0; i < distance; i++) {
            environment = environment.enclosing; // [coupled]
        }
        return environment;
    }
    getAt(distance, name) {
        return this.ancestor(distance).values[name];
    }
    assignAt(distance, name, value) {
        this.ancestor(distance).values[name.value] = value;
    }
    toString() {
        let result = this.values.toString();
        if (this.enclosing != null) {
            result += " -> " + this.enclosing.toString();
        }
        return result;
    }
}
//# sourceMappingURL=Environment.js.map