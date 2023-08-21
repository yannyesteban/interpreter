export declare class JWT {
    private header;
    private payload;
    private key;
    constructor(opt?: any);
    verify(token: string): any;
    generate(payload: any): string;
    getSignature(msg: any): string;
}
