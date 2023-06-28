export class collection {
    constructor(table) {
        const aux = table.split(".");
        if (aux.length === 1) {
            this.table = aux[0];
        }
        else if (aux.length === 2) {
            this.scheme = aux[0];
            this.table = aux[1];
        }
        else if (aux.length === 3) {
            this.scheme = aux[1];
            this.table = aux[2];
        }
    }
    findOne(filter) {
    }
}
//# sourceMappingURL=dataModel.js.map