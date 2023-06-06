import { Native } from "./Native.js";

export class NavMath extends Native{
    private fields = {
        "pi": Math.PI,
        "e": Math.E,
        "cos": (x)=> {
            return Math.cos(x);
        },
        "sin": (x)=> {
            return Math.sin(x);
        },
        "tan": (x)=> {
            return Math.tan(x);
        }
    }
   
    arity(): number {
        return 0;
    }

    get(name: string) {
        if (this.fields[name.toLowerCase()] !== undefined) {
            return this.fields[name.toLowerCase()];
        }

        return undefined;
    }

    eval(method: string, args:Object[]){
        switch(method){
            case "cos":
                return Math.cos(Number(args[0]));
            case "sin":
                return Math.sin(Number(args[0]));                
            
        }

        return undefined;
    }

    toString(){
        return "function built it"
    }
    
}