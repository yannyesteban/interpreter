import { CallableR } from "./CallableR.js";
import { InstanceR } from "./InstanceR.js";
export class ClassR extends CallableR {
    constructor(name, superclass, methods) {
        super();
        this.superclass = superclass;
        this.name = name;
        this.methods = methods;
    }
    findMethod(name) {
        if (this.methods.has(name)) {
            return this.methods.get(name);
        }
        if (this.superclass != null) {
            return this.superclass.findMethod(name);
        }
        return null;
    }
    toString() {
        return this.name;
    }
    call(interpreter, _arguments) {
        const instance = new InstanceR(this);
        const initializer = this.findMethod("init");
        if (initializer != null) {
            initializer.bind(instance).call(interpreter, _arguments);
        }
        return instance;
    }
    arity() {
        const initializer = this.findMethod("init");
        if (initializer == null) {
            return 0;
        }
        return initializer.arity();
    }
}
//# sourceMappingURL=ClassR.js.map