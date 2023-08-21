export declare const whenDefined: (name: string) => Promise<CustomElementConstructor>;
export declare const getParentElement: (child: any, parentTag: string) => any;
export declare const fire: (element: any, name: any, detail: any) => void;
export declare const whenApp: (child: any) => Promise<unknown>;
export declare const whenElement: (parent: any, element: any) => Promise<unknown>;
