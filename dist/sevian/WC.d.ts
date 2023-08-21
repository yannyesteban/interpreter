export interface WCModule {
    src: string;
    name: string;
    wc: string;
}
export declare function LoadModules(modules: WCModule[]): Promise<void>;
