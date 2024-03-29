export class UserInfo {
}
export class OutputInfo {
    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
}
export class InfoElement {
    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
}
export class Element {
    getResponse() {
        return this._response;
    }
    doResponse(response) {
        this._response = response;
    }
}
export class AppElement extends Element {
}
//# sourceMappingURL=element.js.map