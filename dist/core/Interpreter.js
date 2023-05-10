import { Token } from "./Token.js";
var Interpreter = /** @class */ (function () {
    function Interpreter() {
    }
    Interpreter.prototype.interpret = function (statements) {
        try {
            console.log(JSON.stringify(statements));
            for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                var stmt = statements_1[_i];
                console.log("> ", stmt.expression.operator);
                var r = this.execute(stmt.expression);
                console.log(r);
            }
        }
        catch (error) {
            //Lox.runtimeError(error);
        }
    };
    Interpreter.prototype.execute = function (stmt) {
        stmt.accept(this);
    };
    Interpreter.prototype.visitBinaryExpr = function (expr) {
        var op = expr.tok;
        console.log("*****", expr.operator);
        switch (op) {
            case Token.ADD:
                return expr.left.value + expr.right.value;
        }
    };
    return Interpreter;
}());
export { Interpreter };
//# sourceMappingURL=Interpreter.js.map