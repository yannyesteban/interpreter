export declare abstract class Native {
    abstract get(name: string): any;
    abstract eval(method: string, _arguments: Object[]): any;
}
