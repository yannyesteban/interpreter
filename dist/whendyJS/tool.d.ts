export declare enum LoadMode {
    TEXT = 1,
    JSON = 2,
    ARRAY = 3
}
export declare function loadJsonFile(name: string): any;
export declare function loadFile(name: string, mode?: LoadMode): any;
export declare class Tool {
    static loadJsonFile(name: string): any;
    static loadFile(name: string, mode?: LoadMode): any;
}
