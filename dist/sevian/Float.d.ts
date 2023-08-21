export declare class Float {
    e: any;
    _mousedown: (event: any) => void;
    _touchstart: (event: any) => void;
    constructor(config: any);
    static getBoundingPage(): {
        pageWidth: number;
        pageHeigh: number;
        scrollTop: number;
        scrollLeft: number;
    };
    stop(): void;
    static init(config: any): Float;
    static upIndex(e: any): void;
    static setIndex(e: any): void;
    static getXY(e: any): {
        left: any;
        top: any;
        width: any;
        height: any;
        cW: number;
        cH: number;
        sT: number;
        sL: number;
    };
    static showElem(opt: any): {
        e: any;
        left: any;
        top: any;
        z: any;
    };
    static show(opt: any): {
        e: any;
        left: any;
        top: any;
        z: any;
    };
    static showMenu(opt: any): {
        e: any;
        left: any;
        top: any;
        z: any;
    };
    static dropDown(opt: any): {
        e: any;
        left: any;
        top: any;
        z: any;
    };
    static center(e: any): void;
    static floatCenter(e: any): void;
    static move(e: any, left: any, top: any): void;
    static float(opt: any): void;
    static max(e: any): void;
}
export declare class Drag {
    e: HTMLElement;
    onCapture: (config: any) => void;
    onDrag: (config: any) => void;
    onRelease: (config: any) => void;
    _mouseDown: (event: any) => void;
    constructor(config: any);
    stop(): void;
    static init(config: any): Drag;
}
export declare class Move {
    static init(config: any): Drag;
}
export declare class Resize {
    main: HTMLElement;
    modeX: number;
    modeY: number;
    _drag: Drag[];
    static holders: {
        className: string;
        backgroundColor: string;
        cursor: string;
        left: string;
        top: string;
        width: string;
        height: string;
        margin: string;
        modeX: number;
        modeY: number;
    }[];
    constructor(config: any);
    stop(): void;
    static init(config: any): Resize;
}
