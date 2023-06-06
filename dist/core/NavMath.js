var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Native } from "./Native.js";
var NavMath = /** @class */ (function (_super) {
    __extends(NavMath, _super);
    function NavMath() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = {
            "pi": Math.PI,
            "e": Math.E,
            "cos": function (x) {
                return Math.cos(x);
            },
            "sin": function (x) {
                return Math.sin(x);
            },
            "tan": function (x) {
                return Math.tan(x);
            }
        };
        return _this;
    }
    NavMath.prototype.arity = function () {
        return 0;
    };
    NavMath.prototype.get = function (name) {
        if (this.fields[name.toLowerCase()] !== undefined) {
            return this.fields[name.toLowerCase()];
        }
        return undefined;
    };
    NavMath.prototype.eval = function (method, args) {
        switch (method) {
            case "cos":
                return Math.cos(Number(args[0]));
            case "sin":
                return Math.sin(Number(args[0]));
        }
        return undefined;
    };
    NavMath.prototype.toString = function () {
        return "function built it";
    };
    return NavMath;
}(Native));
export { NavMath };
//# sourceMappingURL=NavMath.js.map