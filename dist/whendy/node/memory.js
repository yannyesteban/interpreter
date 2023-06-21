class Session {
    constructor(id) {
        this.id = null;
        this.data = null;
        this.id;
        this.data = {};
    }
    set(key, value) {
        this.data[key] = value;
    }
    get(key) {
        return this.data[key];
    }
    getSessionId() {
        return this.id;
    }
    delete(key) {
        delete this.data[key];
    }
    loadSession(data) {
        for (const [key, value] of Object.entries(data)) {
            this.data[key] = value;
        }
    }
}
export class Memory {
    constructor() {
        this.sessions = {};
    }
    init(sessionId) {
        if (this.sessions[sessionId] === undefined) {
            this.sessions[sessionId] = new Session(sessionId);
        }
        return this.sessions[sessionId];
    }
    read(sessionId) {
        return this.sessions[sessionId];
    }
}
//# sourceMappingURL=memory.js.map