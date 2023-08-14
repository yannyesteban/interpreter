import { Native } from "./Native.js";
export class NavMath extends Native {
    constructor() {
        super(...arguments);
        this.fields = {
            "pi": Math.PI,
            "e": Math.E,
            "cos": (x) => {
                return Math.cos(x);
            },
            "sin": (x) => {
                return Math.sin(x);
            },
            "tan": (x) => {
                return Math.tan(x);
            }
        };
    }
    arity() {
        return 0;
    }
    get(name) {
        if (this.fields[name.toLowerCase()] !== undefined) {
            return this.fields[name.toLowerCase()];
        }
        return undefined;
    }
    eval(method, args) {
        switch (method) {
            case "cos":
                return Math.cos(Number(args[0]));
            case "sin":
                return Math.sin(Number(args[0]));
        }
        return undefined;
    }
    toString() {
        return "function built it";
    }
}
//# sourceMappingURL=NavMath.js.map