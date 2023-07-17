import { loadScript } from "./../LoadScript.js";
import { loadCss } from "./../LoadCss.js";

import { Q as $ } from "./../Q.js";
import { log } from "console";

export type selector = string;
export interface IForm {
    getValues(): any;
    isValid(arg?: any): boolean;
}

interface FetchInfo {
    method?: string;
    mode?: string;
    headers?;
    body?;
}
interface RequestInfo {
    method?: string;
    mode?: string;
    sendTo?: selector;
    dataForm?;
    request?;
    headers?;
    body?;
    requestFunctions?;
    requestFunction?;
    blockWhile?: selector[];
    confirm?: string;
    valid: any;
}

export interface IResponse {
    id: string;
    type: string;
    data: any;
    reply?: string;
    [key: string]: any;
}

interface IElement {
    id: string;
    wc: string;
    iClass: string;
    component: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    attrs: any;
    props: any;
    data: any;
    setPanel: string;
    appendTo: string;
}

export class App extends HTMLElement {
    public modules = [];
    public components = [];

    public _e = [];

    public token = "x.y.z";
    public sid = "energy";

    public xx = "";
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ["server", "sid", "token", "name"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback", { name, oldVal, newVal });
    }

    connectedCallback() {
        console.log("Custom square element added to page.");
        this.innerHTML = "Loading...";
        this.initApp();
    }

    decodeResponse(data: IResponse[], requestFunctions?: (config) => void[]) {
        console.log(data);

        console.log(data);
        if (!Array.isArray(data)) {
            return;
        }

        data.forEach((item) => {
            if (item.replayToken && requestFunctions && requestFunctions[item.replayToken]) {
                requestFunctions[item.replayToken](item.data);
                return;
            }

            if (item.iToken && requestFunctions && requestFunctions[item.iToken]) {
                requestFunctions[item.iToken](item.data);
                return;
            }

            console.log("item.mode", item.mode);
            switch (item.mode) {
                case "auth":
                    if (item?.props?.token) {
                        this.token = item.props.token;
                        console.log("this.token ", this.token);
                    }
                    break;
                case "debug":
                    console.log(item.info);
                    break;
                case "dataForm":
                    for (let key in item.dataForm) {
                        //this.setVar(key, item.dataForm[key]);
                    }
                    break;
                case "panel":
                    break;
                case "update":
                    console.log(item);
                    this.updateElement(item);
                    break;
                case "response":
                    break;
                case "init":
                    this.initElement(item);
                    break;
                case "fragment":
                    break;
                case "message": //push, delay,
                    /*
                              this.msg = new Float.Message(item);
                                  this.msg.show({});
                                  
                                  */
                    break;
                case "notice": //push, delay,
                    break;
            }
        });
    }

    set cssSheets(data) {
        console.log(data);
        data.forEach((sheet) => {
            loadCss(sheet, true);
        });
    }
    set paz(x) {
        this.xx = x;
        this.setAttribute("xx", x);
    }

    get paz() {
        return this.getAttribute("xx");
    }

    test() {
        const request = {
            confirm: "?",
            valid: true,

            body: {},
            //requestFunction : null,
            requestFunctionss: {
                getEven: (json) => {},
            },
            request: [
                {
                    type: "init",
                    element: "GTMap",
                    id: "test",
                    config: {
                        name: "one",
                        method: "load",
                    },
                    setPanel: "wh-body",
                    setTemplate: null,
                    replayToken: "xxx",
                },
            ],
        };

        this.go(request);
    }

    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            headers: {
                "Application-Name": "summer",
            },
            data: {
                id: this.id,
            },
            requestFunctionS: (data) => {
                data.cssSheets.forEach((sheet) => {
                    loadCss(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;
            },
            request: [],
            request2: [
                {
                    type: "init-app",
                    element: "app",
                    method: "init",
                    id: null,
                    config: {},
                    setPanel: null,
                    setTemplate: null,
                },
            ],
        };

        this.go(request);
    }

    public whenComponent(module) {
        return new Promise((resolve, reject) => {
            if (customElements.get(module.component)) {
                console.log("   A   ", module.component);

                resolve(customElements.get(module.component));
            }

            import(module.src)
                .then((MyModule) => {
                    console.log("   B   ", MyModule);
                    resolve(customElements.get(module.component));
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    updateElement(info) {
        console.log("updateElement", info);
        const e = $.id(info.id);

        if (e) {
            if (info.props) {
                e.prop(info.props);
            }
        }
    }

    importModule(element) {
        const m = this.modules.find((e) => e.name == element.iClass);
        const module = this.modules.find((e) => e.component == element.wc);
        loadScript(m.src, { async: true, type: "module" }).then((info) => {
            const e = $.create(element.wc);
            e.id(element.id);
            e.prop(element.props);
            e.attr(element.attrs);
            let panel = null;
            if (element.setPanel) {
                alert(999);
                panel = $.id(element.setPanel);
                if (panel) {
                    panel.text("");
                    panel.append(e);
                    return;
                }
            }
            if (element.appendTo) {
                alert(8888);
                panel = $(element.appendTo);
                if (panel) {
                    panel.append(e);
                    return;
                }
            }
        });
    }

    initElement(element: IElement | IResponse) {
        console.log("initElement", element, this.modules);

        const module = this.modules.find((e) => e.component == element.wc);

        if (module) {
            console.log("initElement", element);
            this.whenComponent(module)
                .then((component) => {})
                .catch((error) => {
                    console.log(error);
                });
        }

        const e = document.getElementById(element.id);
        if (e) {
            e.remove();
        }

        customElements.whenDefined(element.wc).then(() => {
            const e = $.create(element.wc);

            e.id(element.id);
            e.prop(element.props);
            e.attr(element.attrs);

            let panel = null;
            if (element.setPanel) {
                panel = $(element.setPanel);

                if (panel) {
                    panel.text("");
                    panel.append(e);

                    return;
                }
            } else if (element.appendTo) {
                panel = $(element.appendTo);

                if (panel) {
                    panel.append(e);
                    return;
                }
            }
        });
    }

    set jsModules(jsFiles) {
        jsFiles.forEach((src) => {
            loadScript(src, { async: true, type: "module" });
        });
    }

    set addClass(classes) {
        $(this).addClass(classes);
    }

    set name(value) {
        this.setAttribute("name", value);
    }

    get value() {
        return this.getAttribute("name");
    }

    set server(value) {
        this.setAttribute("server", value);
    }

    get server() {
        return this.getAttribute("server");
    }

    send(info: FetchInfo) {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
                SID: this.sid,
                "Application-Id": this.id,
                "Application-Mode": info.mode,
            };

            fetch(this.server, {
                method: info.method || "post",
                headers: { ...headers, ...info.headers },
                body: info.body,
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    reject(error);
                })
                .then((json) => {
                    resolve(json);
                });
        });
    }

    go(info: RequestInfo) {
        info.body = JSON.stringify({ ...(info.body || {}), __app_request: info.request, __app_id: this.id });
        this.send(info).then((json: any) => {
            if (info.requestFunction) {
                console.log(json);
                info.requestFunction(json);
                return true;
            }
            console.log(json);
            this.decodeResponse(json, info.requestFunctions || null);
        });
    }
}

customElements.define("wh-app", App);
