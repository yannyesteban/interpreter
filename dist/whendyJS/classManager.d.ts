export interface InfoClass {
    name?: string;
    enable?: boolean;
    file?: string;
    class?: string;
    fileConfig?: boolean;
    template?: string;
}
export declare class ClassManager {
    private classes;
    constructor(info: InfoClass[]);
    register(name: any, info: InfoClass): void;
    getClass(name: string): Promise<any>;
    template(name: string): string;
    useFileConfig(name: any): boolean;
}
