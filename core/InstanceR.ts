import { ClassR } from "./ClassR";
import { FunctionR } from "./FunctionR";
import { Item } from "./Lexer";


export class InstanceR {
    private klass: ClassR;
    private fields = new Map();

    constructor(klass: ClassR) {
        this.klass = klass;
    }

    get(name: string) {
        if (this.fields.has(name)) {
            return this.fields.get(name);
        }

        const method: FunctionR = this.klass.findMethod(name);
        if (method != null) {
            return method.bind(this);
        }
        
        throw "Undefined property '" + name + "'."//new RuntimeError(name, "Undefined property '" + name.value + "'.");
    }

    set(name: Item, value: Object) {
        this.fields.set(name.value, value);
    }

    toString() {
        return this.klass.name + " instance";
    }
}
