var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _class = {};
export function register(info) {
    info.forEach(i => {
        _class[i.name] = i;
    });
}
export function getClass(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = _class[name];
        if (!(info === null || info === void 0 ? void 0 : info.file)) {
            return null;
        }
        let module = yield import(info.file);
        if (module[info.class]) {
            return module[info.class];
        }
        else {
            throw new Error("module don't exits");
        }
    });
}
//# sourceMappingURL=classManager.js.map