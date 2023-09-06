import { Store } from "./store.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import { ClassManager } from "./classManager.js";
import { Authorization } from "./Authorization.js";
import { EvalWhen } from "./EvalWhen.js";

enum AppMode {
    START = 1,
    RESTAPI,
}

export interface InfoClass {
    name: string;
    enable: boolean;
    file: string;
    class: string;
}

export class Whendy {
    public store: Store;
    public authorization: Authorization;
    private output: OutputInfo[] = [];
    private restData: any;
    private mode: AppMode;
    private appInfo: InfoElement;
    private start: InfoElement;

    public classes: ClassManager;
    async render(request) {
        this.output = [];

        await this.evalRequest(request);

        if (this.mode === AppMode.RESTAPI) {
            return JSON.stringify(this.restData);
        }

        return JSON.stringify(this.output);
    }

    setStart(info: InfoElement) {
        this.start = info;
    }
    setMode(mode: AppMode) {
        this.mode = mode;
    }
    addResponse(response: OutputInfo[]) {
        this.output = [...this.output, ...response];
    }

    async evalRequest(requests: []) {
        for (let request of requests) {
            await this.setElement(request);
        }
    }

    getElementConfig(element, name) {
        let template = this.classes.template(element);

        template = "./app/modules/admin/" + template.replace("{name}", name);

        return this.store.loadJsonFile(template);
    }

    async setElement(info: InfoElement) {
        if (info.doWhen) {
            const evalWhen = new EvalWhen(this.store.getVSes());
            if (!evalWhen.eval(info.doWhen)) {
                console.log("element aborted");
                return;
            }
        }

        const id = info.id;
        const panel = info.panel;
        const api = info.api;
        const name = info.name;
        const method = info.method;
        const params = info.params;

        this.store.setExp("ID_", id);
        this.store.setExp("API_", api);
        this.store.setExp("PARAMS_", params);
        //this.store.LoadExp(info.params)

        const cls = await this.classes.getClass(api);

        if (!cls) {
            console.log("error, clas not found");
            return;
        }

        const ele: Element = new cls();

        ele.setStore(this.store);
        let config = info;
        if (this.classes.useFileConfig(api) && name) {
            config = { ...this.getElementConfig(api, name), ...info };
        }

        ele.init(config);
        const data = await ele.evalMethod(method);

        if (this.mode == AppMode.RESTAPI) {
            this.doRestData(ele);
        } else {
            let response = ele.getResponse();
            if (response) {
                if (info.do != "data") {
                    response = {
                        do: info.do,
                        to: info.to,
                        id: info.id,
                        api: info.api,
                        name: info.name,
                        params: info.params,
                        ...response,
                    };
                }

                this.addResponse([response]);
           }
        }

        this.doUserAdmin(ele);
        await this.doElementAdmin(ele);
    }

    async doElementAdmin(ele: IElementAdmin | Element) {
        if ("getElements" in ele) {
            const elements = ele.getElements();
            if (!Array.isArray(elements)) {
                return false;
            }

            for (const element of elements) {
                await this.setElement(element);
            }
        }
    }

    async doUserAdmin(ele: IUserAdmin | Element) {
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
    }

    doRestData(ele: IRestElement | Element) {
        if ("getRestData" in ele) {
            this.setRestData(ele.getRestData());
        }
    }

    setRestData(data) {
        this.restData = data;
    }
}
