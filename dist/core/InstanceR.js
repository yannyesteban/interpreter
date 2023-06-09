export class InstanceR {
    constructor(klass) {
        this.fields = new Map();
        this.klass = klass;
    }
    get(name) {
        if (this.fields.has(name)) {
            return this.fields.get(name);
        }
        const method = this.klass.findMethod(name);
        if (method != null) {
            return method.bind(this);
        }
        throw "Undefined property '" + name + "'."; //new RuntimeError(name, "Undefined property '" + name.value + "'.");
    }
    set(name, value) {
        this.fields.set(name.value, value);
    }
    toString() {
        return this.klass.name + " instance";
    }
}
//# sourceMappingURL=InstanceR.js.map