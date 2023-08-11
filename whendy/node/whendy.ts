import { Store } from "./store.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import { ClassManager } from "./classManager.js";
import { Authorization } from "./Authorization.js";

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

        template = "modules/admin/" + template.replace("{name}", name);

        return this.store.loadJsonFile(template);
    }

    async setElement(info: InfoElement) {
        this.store.setExp("ID_", info.id);
        this.store.setExp("ELEMENT_", info.element);
        //this.store.LoadExp(info.eparams)

        const cls = await this.classes.getClass(info.element);

        if (!cls) {
            console.log("error, clas not found");
            return;
        }

        const ele: Element = new cls();

        ele.setStore(this.store);
        let config = info;
        if (this.classes.useFileConfig(info.element)) {
            config = { ...this.getElementConfig(info.element, info.name), ...info };
        }

        ele.init(config);
        const data = await ele.evalMethod(info.method);

        if (this.mode == AppMode.RESTAPI) {
            this.doRestData(ele);
        } else {
            const data = ele.getResponse();

            let response: OutputInfo = null;

            switch (info.type) {
                case "set":
                    this.addResponse( [{
                        dinamic:false, 
                        ...info,
                        data,
                    }]);
                    break;
                case "element":
                    this.addResponse( [{
                        dinamic:false,
                        ...info,
                        //type: info.type,
                        //setPanel: info.setPanel,
                        //appendTo: info.appendTo,
                        //id: info.id,
                        data,
                    }]);
                    break;
            }

            //this.addResponse([response]);
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
