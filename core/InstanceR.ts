import { ClassR } from "./ClassR";
import { FunctionR } from "./FunctionR";
import { Item } from "./Lexer";


export class InstanceR {
    private klass: ClassR;
    private fields = new Map();

    constructor(klass: ClassR) {
        this.klass = klass;
    }

    get(name: Item) {
        if (this.fields.has(name.value)) {
            return this.fields.get(name.value);
        }

        const method: FunctionR = this.klass.findMethod(name.value);
        if (method != null) {
            return method.bind(this);
        }
        
        throw ""//new RuntimeError(name, "Undefined property '" + name.value + "'.");
    }

    set(name: Item, value: Object) {
        this.fields.set(name.value, value);
    }

    toString() {
        return this.klass.name + " instance";
    }
}
