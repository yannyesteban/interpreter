export abstract class  Native {

    abstract get(name:string);
    abstract eval(method: string, _arguments: Object[]);

}