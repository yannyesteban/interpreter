export class UserInfo {
}
export class InfoElement {
    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
}
export class Element {
}
export class AppElement extends Element {
}
//# sourceMappingURL=element.js.map