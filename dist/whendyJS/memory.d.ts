import { IMachine, ISession } from './manager';
export declare class Memory implements IMachine {
    sessions: {
        [key: string]: ISession;
    };
    init(sessionId: any): ISession;
    read(sessionId: string): ISession;
}
