export interface IDateInfo {
    year?: number | string;
    month?: number | string;
    day?: number | string;
    hour?: number | string;
    minute?: number | string;
    second?: number | string;
    ampm?: string;
}
export declare class DateUtil {
    static parse(source: any, pattern: any): DateUtil;
    static date(source: any, pattern: any): Date;
    static valid(source: any, pattern: any): boolean;
}
