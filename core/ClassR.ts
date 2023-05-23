
import { CallableR } from "./CallableR.js";
import { FunctionR } from "./FunctionR.js";
import { InstanceR } from "./InstanceR.js";
import { Interpreter } from "./Interpreter.js";



export class ClassR implements CallableR {
    
    public name: string;
    public superclass: ClassR;
    private methods: Map<string, FunctionR>;

    constructor(name: string, superclass: ClassR, methods: Map<string, FunctionR>) {
        this.superclass = superclass;
        this.name = name;
        this.methods = methods;
    }

    findMethod(name: string): FunctionR {
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

    call(interpreter: Interpreter, _arguments: Object[]) {
        const instance = new InstanceR(this);
        const initializer = this.findMethod("init");

        if (initializer != null) {
            initializer.bind(instance).call(interpreter, _arguments);
        }

        return instance;
    }

    arity() {
        const initializer: FunctionR = this.findMethod("init");
        if (initializer == null) {
            return 0;
        }
        return initializer.arity();
    }
}
