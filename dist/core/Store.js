var Store = /** @class */ (function () {
    function Store() {
        this.level = -1;
        this.scope = [];
    }
    Store.prototype.open = function () {
        this.scope.push(this.level);
        this.level++;
    };
    return Store;
}());
export { Store };
//# sourceMappingURL=Store.js.map