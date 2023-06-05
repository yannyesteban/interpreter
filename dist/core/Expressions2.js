export var ExprType;
(function (ExprType) {
    ExprType[ExprType["IDENT"] = 1] = "IDENT";
    ExprType[ExprType["LITERAL"] = 2] = "LITERAL";
    ExprType[ExprType["BINARY"] = 3] = "BINARY";
    ExprType[ExprType["TERNARY"] = 4] = "TERNARY";
    ExprType[ExprType["UNARY"] = 5] = "UNARY";
    ExprType[ExprType["GROUP"] = 6] = "GROUP";
    ExprType[ExprType["FLOAT"] = 7] = "FLOAT";
    ExprType[ExprType["ASSIGN"] = 8] = "ASSIGN";
    ExprType[ExprType["POST_ASSIGN"] = 9] = "POST_ASSIGN";
    ExprType[ExprType["PRE_ASSIGN"] = 10] = "PRE_ASSIGN";
    ExprType[ExprType["VARIABLE"] = 11] = "VARIABLE";
    ExprType[ExprType["GET"] = 12] = "GET";
    ExprType[ExprType["SET"] = 13] = "SET";
    ExprType[ExprType["LOGICAL"] = 14] = "LOGICAL";
    ExprType[ExprType["PAR"] = 15] = "PAR";
    ExprType[ExprType["OBJECT"] = 16] = "OBJECT";
    ExprType[ExprType["ARRAY"] = 17] = "ARRAY";
    ExprType[ExprType["CALL"] = 18] = "CALL";
    ExprType[ExprType["SUPER"] = 19] = "SUPER";
    ExprType[ExprType["THIS"] = 20] = "THIS";
})(ExprType || (ExprType = {}));
var Expression = /** @class */ (function () {
    function Expression(type, items, pos) {
        this.type = type;
        this.items = items;
        this.pos = pos;
    }
    return Expression;
}());
export { Expression };
//# sourceMappingURL=Expressions2.js.map