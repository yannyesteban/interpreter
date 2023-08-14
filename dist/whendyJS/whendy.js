var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            this.store.setExp("ID_", info.id);
            this.store.setExp("ELEMENT_", info.element);
            //this.store.LoadExp(info.eparams)
            const cls = yield this.classes.getClass(info.element);
            if (!cls) {
                console.log("error, clas not found");
                return;
            }
            const ele = new cls();
            ele.setStore(this.store);
            let config = info;
            if (this.classes.useFileConfig(info.element)) {
                config = Object.assign(Object.assign({}, this.getElementConfig(info.element, info.name)), info);
            }
            ele.init(config);
            const data = yield ele.evalMethod(info.method);
            if (this.mode == AppMode.RESTAPI) {
                this.doRestData(ele);
            }
            else {
                const data = ele.getResponse();
                let response = null;
                switch (info.type) {
                    case "set":
                        this.addResponse([Object.assign(Object.assign({ dinamic: false }, info), { data })]);
                        break;
                    case "element":
                        this.addResponse([Object.assign(Object.assign({ dinamic: false }, info), { 
                                //type: info.type,
                                //setPanel: info.setPanel,
                                //appendTo: info.appendTo,
                                //id: info.id,
                                data })]);
                        break;
                }
                //this.addResponse([response]);
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