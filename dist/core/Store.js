export class Store {
    constructor() {
        this.level = -1;
        this.scope = [];
    }
    open() {
        this.scope.push(this.level);
        this.level++;
    }
}
//# sourceMappingURL=Store.js.map