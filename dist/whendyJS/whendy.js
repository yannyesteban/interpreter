var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EvalWhen } from "./EvalWhen.js";
var AppMode;
(function (AppMode) {
    AppMode[AppMode["START"] = 1] = "START";
    AppMode[AppMode["RESTAPI"] = 2] = "RESTAPI";
})(AppMode || (AppMode = {}));
export class Whendy {
    constructor() {
        this.output = [];
    }
    render(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.output = [];
            yield this.evalRequest(request);
            if (this.mode === AppMode.RESTAPI) {
                return JSON.stringify(this.restData);
            }
            return JSON.stringify(this.output);
        });
    }
    setStart(info) {
        this.start = info;
    }
    setMode(mode) {
        this.mode = mode;
    }
    addResponse(response) {
        this.output = [...this.output, ...response];
    }
    evalRequest(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let request of requests) {
                yield this.setElement(request);
            }
        });
    }
    getElementConfig(element, name) {
        let template = this.classes.template(element);
        template = "./app/modules/admin/" + template.replace("{name}", name);
        return this.store.loadJsonFile(template);
    }
    setElement(info) {
        return __awaiter(this, void 0, void 0, function* () {
            if (info.doWhen) {
                const evalWhen = new EvalWhen(this.store.getVSes());
                if (!evalWhen.eval(info.doWhen)) {
                    console.log("element aborted");
                    return;
                }
            }
            const id = info.id;
            const api = info.api;
            const name = info.name;
            const method = info.method;
            const params = info.params || {};
            this.store.setExp("ID_", id);
            this.store.setExp("DO_", info.do);
            this.store.setExp("TO_", info.to);
            this.store.setExp("API_", api);
            this.store.setExp("NAME_", name);
            this.store.setExp("METHOD_", method);
            this.store.setExp("PARAMS_", params);
            //this.store.LoadExp(info.params)
            const cls = yield this.classes.getClass(api);
            if (!cls) {
                console.log("error, clas not found");
                return;
            }
            const ele = new cls();
            ele.setStore(this.store);
            let config = info;
            if (this.classes.useFileConfig(api) && name) {
                config = Object.assign(Object.assign({}, this.getElementConfig(api, name)), info);
            }
            ele.init(config);
            const data = yield ele.evalMethod(method);
            if (this.mode == AppMode.RESTAPI) {
                this.doRestData(ele);
            }
            else {
                let response = ele.getResponse();
                if (response) {
                    if (info.do != "data") {
                        response = Object.assign({ do: info.do, to: info.to, id: info.id, api: info.api, name: info.name, params: info.params }, response);
                    }
                    this.addResponse([response]);
                }
            }
            this.doUserAdmin(ele);
            yield this.doElementAdmin(ele);
        });
    }
    doElementAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getElements" in ele) {
                const elements = ele.getElements();
                if (!Array.isArray(elements)) {
                    return false;
                }
                for (const element of elements) {
                    yield this.setElement(element);
                }
            }
        });
    }
    doUserAdmin(ele) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getUserInfo" in ele) {
                const info = ele.getUserInfo();
                if (info.auth) {
                    const token = this.authorization.setAuth(info);
                    this.addResponse([
                        {
                            type: "token",
                            data: token,
                        },
                    ]);
                    //token := whendy.Store.User.Set(info)
                    //whendy.w.Header().Set("Authorization", token)
                }
            }
        });
    }
    doRestData(ele) {
        if ("getRestData" in ele) {
            this.setRestData(ele.getRestData());
        }
    }
    setRestData(data) {
        this.restData = data;
    }
}
//# sourceMappingURL=whendy.js.map