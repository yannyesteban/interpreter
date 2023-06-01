import { Item } from "./Lexer.js";


export class Environment {
    
    public enclosing: Environment;
    private values: Object = {};
    
    constructor(enclosing?) {
        if (enclosing !== undefined) {
            this.enclosing = enclosing;
        }else{
            this.enclosing = null;
        }
    }

    get(name: Item) {
        if (name.value in this.values) {
            return this.values[name.value];
        }

        if (this.enclosing != null) {
            return this.enclosing.get(name);
        }
        console.log("Undefined variable '" + name.value + "'.")
        throw ""//new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }

    assign(name: Item, value: Object) {
        if (name.value in this.values) {
            this.values[name.value] = value;
            return;
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw ""//new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }

    define(name: string, value: Object) {
        this.values[name] = value;
    }

    ancestor(distance: number) {
        let environment: Environment = this;
        for (let i = 0; i < distance; i++) {
            environment = environment.enclosing; // [coupled]
        }

        return environment;
    }

    getAt(distance: number, name: string) {
        return this.ancestor(distance).values[name];
    }

    assignAt(distance: number, name: Item, value: Object) {
        this.ancestor(distance).values[name.value] = value;
    }

    public toString() {
        let result: string = this.values.toString();
        if (this.enclosing != null) {
            result += " -> " + this.enclosing.toString();
        }

        return result;
    }
}
