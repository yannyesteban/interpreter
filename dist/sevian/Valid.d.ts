export interface IRuleInfo {
    required?: any;
    alpha?: any;
    alphanumeric?: any;
    nospaces?: any;
    numeric?: any;
    positive?: any;
    integer?: any;
    email?: any;
    date?: any;
    time?: any;
    exp?: any;
    minlength?: any;
    maxlength?: any;
    greater?: any;
    less?: any;
    greatestequal?: any;
    lessequal?: any;
}
export declare function setLanguage(lang: any): void;
export declare function setMessage(lang: any, message: any): void;
export declare function valid(rules: IRuleInfo, value: string, title: string): {
    error: boolean;
    message: any;
};
