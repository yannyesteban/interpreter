import { Store } from "./store.js";
import { InfoElement, Element, IRestElement, IElementAdmin, IUserAdmin, OutputInfo } from "./element.js";
import * as classManager from "./classManager.js";
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

    async render() {
        this.output = [];

        if (this.start) {
            await this.setElement(this.start);
        }

        let request = this.store.getReq("__app_request");

        if (request) {
            if (typeof request === "string") {
                request = JSON.parse(request);
            }

            await this.evalRequest(request);
        }

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
            await this.evalCommand(request);
        }
    }

    async evalCommand(command) {
        switch (command.type) {
            case "init":
                await this.setElement(command);
                break;

            case "element":
                await this.setElement(command);
                break;
            case "update":

            default:
        }
    }

    getElementConfig(element, name) {
        let template = classManager.template(element);

        template = "modules/admin/" + template.replace("{name}", name);

        return this.store.loadJsonFile(template);
    }

    async setElement(info: InfoElement) {
        this.store.setExp("ID_", info.id);
        this.store.setExp("ELEMENT_", info.element);
        //this.store.LoadExp(info.eparams)

        const cls = await classManager.getClass(info.element);

        if (!cls) {
            console.log("error, clas not found");
            return;
        }

        const ele: Element = new cls();

        ele.setStore(this.store);
        let config = info;
        if (classManager.useFileConfig(info.element)) {
            config = { ...this.getElementConfig(info.element, info.name), ... info };
        }

        ele.init(config);
        await ele.evalMethod(info.method);

        if (this.mode == AppMode.RESTAPI) {
            this.doRestData(ele);
        } else {
            this.addResponse(ele.getResponse());
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
                        mode: "auth",
                        props: { token },
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
