import * as Eval from "./../Eval.js";
import { loadScript } from "./../LoadScript.js";
import { loadCss } from "./../LoadCss.js";

import { Q as $ } from "./../Q.js";
import * as wc from "./../WC.js";
import { AppRequest, ElementResponse, FetchInfo, IElement, IResponse, LRequest } from "../IApp.js";
import "./AppRequest.js";

export class Sevian extends HTMLElement {
    private panels: any = {};
    private _modules: wc.WCModule[] = [];

    private triggers = {};

    static get observedAttributes() {
        return ["server"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:block;

			}
            main{
           
                display:flex;
            }
			</style>
            <main><slot></slot></main>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    handleEvent(event: any) {
        if (event.type == "click") {
            const target = event.target.closest("ss-action");

            console.log("Woooao", event.target);
        } else if (event.type == "app-request") {
            console.log("*********", event.detail);
            this.fetch(event.detail);
        } else if (event.type == "app-action") {
            const action = event.detail;
            let request: LRequest = {};
            let context = null;
            const target = event.target;
            console.log(target, action, event.target.actionContext)
            if (event.target.actionContext) {
                context = target.closest(event.target.actionContext);
            } else if (event.target.useContext) {
                context = this.querySelector(event.target.actionContext);
            } else {
                context = this;
            }

            if (typeof context.getAppRequest === "function") {
                request = context.getAppRequest(action);
                console.log(action, context, request);
            } else {
                const elem: any = this.querySelector(`app-request[name="${action}"]`);
                if (elem) {
                    request = elem.data;
                }
            }

            if (!request.sendTo) {
                request.sendTo = context;

                console.log(request.sendTo);
            }

            console.log(request);

            this.fetch(request);
            //return this.querySelector(`app-request[name="${name}"]`);
        }
    }

    public connectedCallback() {
        this.classList.add("_main_app_");
        this.addEventListener("app-request", this);
        this.addEventListener("app-action", this);
        return;
        // Select the node that will be observed for mutations
        const targetNode = this;

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, /*attributeFilter: ['error-messages'],*/ childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    const ss = Array.from(mutation.target.querySelectorAll("[ss-trigger]"));

                    if (ss) {
                        console.log(ss);
                        ss.forEach((s: any) => {
                            const trigger = s.getAttribute("ss-trigger");
                            if (!this.triggers[trigger]) {
                                this.addEventListener(trigger, this);
                                this.triggers[trigger] = true;
                            }
                        });
                    }
                } else if (mutation.type === "attributes") {
                    console.log(`The ${mutation.attributeName} attribute was modified. `);
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        //observer.disconnect();

        return;
        const ss = Array.from(this.querySelectorAll("[ss-trigger]"));
        if (ss) {
            console.log(ss);
            ss.forEach((s: any) => {
                const trigger = s.getAttribute("ss-trigger");
                if (!this.triggers[trigger]) {
                    this.addEventListener(trigger, this);
                    this.triggers[trigger] = true;
                }
            });
        }
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, old, value) {
        switch (name) {
            case "server":
                this.initApp();
                break;
        }
    }

    set server(value) {
        if (Boolean(value)) {
            this.setAttribute("server", value);
        } else {
            this.removeAttribute("server");
        }
    }

    get server() {
        return this.getAttribute("server");
    }

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    set className(value) {
        if (Boolean(value)) {
            $(this).addClass(value);
            //this.setAttribute("className", value);
        } else {
            this.removeAttribute("className");
        }
    }

    get className() {
        return this.getAttribute("class");
    }

    set token(value) {
        if (Boolean(value)) {
            this.setAttribute("token", value);
        } else {
            this.removeAttribute("token");
        }
    }

    get token() {
        return this.getAttribute("token");
    }

    private async whenValid(name: string) {
        return new Promise(async (resolve, reject) => {
            if (!name) {
                reject();
                return;
            }
            const element = this.modules?.find((e) => e.name.toUpperCase() === name.toUpperCase())?.wc || name;

            console.log(`%c Element: %c${element}, %s`, "color:yellow", "color:aqua", name);
            if (element.indexOf("-") < 0 || !element) {
                resolve(element);
                return;
            }

            await customElements
                .whenDefined(element)
                .then((what) => {
                    resolve(element);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async setElement(info: IElement) {
        await this.whenValid(info.element)
            .then((element) => {
                let e = $.id(info.id);
                if (e) {
                    e.remove();
                }

                e = $.create(element);
                e.id(info.id);
                e.prop(info.propertys);

                let panel;
                //set-panel, set-element, update, append-to, before-to, request, request-to, DATA?
                if (info.do == "set-panel") {
                    console.log(info);
                    panel = $(`#${info.to}`);
                    panel.text("");
                } else if (info.do == "set-element") {
                    panel = $(info.to);
                    panel.text("");
                }else if (info.do == "append-to") {
                    
                    panel = $(info.to);
                    
                    
               
                }

                //const panel = $(`#${info.panel}` || info.setTo || info.appendTo);

                if (!panel) {
                    return;
                }

                if (info.panel || info.setTo) {
                    panel.text("");
                }
                
                panel.append(e);
            })
            .catch((error) => {
                console.log("element not found");
            });
    }

    async updateElement(info) {
        await this.whenValid(info.element)
            .then(() => {
                const e = $.id(info.id);

                if (e) {
                    if (info.propertys) {
                        e.prop(info.propertys);
                    }
                }
            })
            .catch((error) => {
                console.log("element not found");
            });
    }

    async evalResponse(response: IElement[]) {
        console.log(response);
        for (const r of response) {
            switch (r.do) {
                case "set-panel":
                    await this.setElement(r);

                    if (r.panel) {
                        this.panels[r.panel] = r;
                    }
                    break;
                case "append-to":
                    await this.setElement(r);
                    break;                    
                case "update":
                    await this.updateElement(r);
                    break;
            }

            if (r.message) {
                this.showMessage({
                    type: "alert",
                    caption: "Sevian 1.0",
                    delay: 2000,
                    text: r.message,
                    className: "x",
                    left: "center",
                    top: "20px",

                    autoClose: "true",
                });
            }

            if (r.log) {
                console.log(r.log);
            }
        }

        return true;
    }

    initApp() {
        /*
        const btn = $("#x");
        btn.on("click", (e) => {
            this.sendForm({
                form: "#p1",
                store: ["a", "c"],
                blockLayers: ["#p3", "#p2", "#x"],
                blockForm: true,
                reportValidity: true,

                //confirm:"hello"
            });
        });
        */
        window.history.pushState({ a: 2 }, "yanny", "?page=2");
        console.log(window.history.state);
        const request = {
            headers: {
                "Application-Name": this.name,
            },

            actions: [
                {
                    type: "property",

                    element: "form",
                    name: "city",
                    mode: "property",
                    id: "x",
                    property: "dataSource",
                },
            ],
        };

        this.send(request);
    }

    set cssSheets(data) {
        data.forEach((sheet) => {
            loadCss(sheet, true);
        });
    }

    set jsModules(files) {
        files.forEach((src) => {
            loadScript(src, { async: true, type: "module" });
        });
    }

    set modules(info) {
        this._modules = info;
        wc.LoadModules(info);
    }

    get modules() {
        return this._modules;
    }

    getStore(): any {
        return {
            a: "one",
            b: "two",
            c: "three",
        };
    }

    sendFormData(request) {
        request.contentType = "multipart/form-data";
        this.send(request);
    }

    sendForm(request) {
        request.contentType = "application/x-www-form-urlencoded";
        this.send(request);
    }

    sendJson(request) {
        request.contentType = "application/json";
        this.send(request);
    }

    showMessage(message) {
        const popup = $(this).findOrCreate("ss-popup", "ss-popup").get<any>();
        popup.dataSource = message;
        popup.mode = "open";
    }

    evalDataElement(obj, data) {
        const str = Eval.evalAll(JSON.stringify(obj), data);

        if (str) {
            return JSON.parse(str);
        }

        return obj;
    }

    evalExp(obj, data) {
        const str = Eval.evalAll(JSON.stringify(obj), { ...this.getStore(), ...data });

        if (str) {
            return JSON.parse(str);
        }

        return obj;
    }

    fetch(request: LRequest) {
        let element = null;

        if (request.sendTo && request.sendTo instanceof HTMLElement) {
            element = request.sendTo;
        } else if (request.sendTo && typeof request.sendTo === "string") {
            element = this.querySelector(request.sendTo);
        }

        if (request.valid && typeof element?.valid === "function") {
            const error = element.valid(request.validOption || undefined);
            if (error) {
                this._showError(error);
                return;
            }
        }

        if (request.confirm && !window.confirm(request.confirm)) {
            return;
        }
        let actions = request.actions || [];

        if (element && actions) {
            
            actions = this.evalDataElement(actions, element);
            console.log("actions", actions,element);
        }

        const masterData = request.masterData;

        if (masterData && actions) {
            actions = this.evalExp(actions, masterData);
        }

        let form: HTMLFormElement = null;
        let data = new FormData();
        if (element) {
            form = element.closest("form");
        }

        if (form) {
            if (request.validForm && !form.reportValidity()) {
                return;
            }

            data = new FormData(form);
        }

        let store: any = {};

        if (request?.globalStore === true) {
            store = this.getStore();
        } else if (Array.isArray(request?.globalStore)) {
            store = request.globalStore.reduce((s: any, e: string) => ((s[e] = store[e]), s), {});
        }

        if (request?.sendStore === true && typeof element.getStore === "function") {
            const _store = element.getStore();
            store = { ...store, ..._store };
        } else if (typeof request?.sendStore === "object") {
            store = { ...store, ...request.sendStore };
        }

        if (request.body) {
            for (const [key, value] of Object.entries(request.body)) {
                data.append(key, value);
            }
        }

        let contentType = request.contentType === undefined ? "application/json" : request.contentType;

        let body: FormData | any = {};
        if (contentType === "application/json") {
            body = JSON.stringify({
                ...Object.fromEntries(data.entries()),
                __app_request: actions,
                __app_store: store,
            });
        } else {
            body.append("__app_request", JSON.stringify(actions));
            if (store) {
                body.append("__app_store", JSON.stringify(store));
            }

            if (contentType === "application/x-www-form-urlencoded") {
                body = new URLSearchParams(body);
            } else {
                contentType = null;
            }
        }

        const layers = [];

        if (request.blockTo === true && element) {
            layers.push(this._createBlockLayer(element));
        } else if (request.blockTo === true && form) {
            layers.push(this._createBlockLayer(form));
        } else if (Array.isArray(request.blockTo)) {
            request.blockTo.forEach((e) => layers.push(this._createBlockLayer(e)));
        }

        const headers = {
            Authorization: `Bearer ${this.token}`,
            "Application-Id": this.id,
            "Application-Mode": request.mode,
            ...request.headers,
        };

        if (contentType) {
            headers["Content-Type"] = contentType;
        }

        fetch(this.server /*"http://localhost/phpserver/"*/, {
            method: request.method || "post",
            headers,
            body,
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            })
            .then((json) => {
                this.evalResponse(json);
            })
            .finally(() => {
                layers.forEach((layer) => {
                    layer.remove();
                });
            });
    }

    send(request: AppRequest, masterData?: any) {
        masterData = request.masterData || masterData;

        if (masterData && request.actions) {
            request.actions = this.evalExp(request.actions, masterData);
        }

        let validate;

        if (typeof request.validate === "function") {
            validate = request.validate;
        } else if (typeof request.validate === "string") {
            const element: any = $(request.validate).get();
            if (element && typeof element.valid === "function") {
                validate = $.bind(element.valid, element);
            }
        } else if (typeof request.validate === "object" && "valid" in request.validate) {
            validate = request.validate.valid;
        }

        if (validate) {
            const error = validate(request.validateOption);
            if (error) {
                this.showMessage({
                    type: "alert",
                    caption: "Error!",
                    delay: 5000,
                    text: error,
                    className: "x",
                    left: "center",
                    top: "20px",

                    autoClose: "true",
                });
                return;
            }
        }

        if (request.confirm && !window.confirm(request.confirm)) {
            return;
        }

        let form: HTMLFormElement = null;
        console.log(request.form);
        if (typeof request.form === "string") {
            form = $(request.form).get();
        } else if (request.form instanceof HTMLFormElement) {
            form = request.form;
        } else if (request.form instanceof HTMLElement) {
            form = request.form.closest("form");
        }

        if (form && request.reportValidity && !form.reportValidity()) {
            return;
        }

        let body: FormData | any;
        let actions = request.actions || [];
        let store: any = {};
        const _store = this.getStore();

        if (form) {
            body = new FormData(form);
        } else {
            body = new FormData();
        }

        if (request["setFormValue"]) {
            for (const [key, value] of Object.entries(request["setFormValue"]) as any) {
                body.append(key, value);
            }
        }

        if (request.store === true) {
            store = _store;
        } else if (Array.isArray(request.store)) {
            store = request.store.reduce((store: any, e: string) => ((store[e] = _store[e]), store), {});
        } else if (typeof request.store === "object") {
            store = request.store;
        }

        let contentType = request.contentType === undefined ? "application/json" : request.contentType;

        if (contentType === "application/json") {
            body = JSON.stringify({
                ...Object.fromEntries(body.entries()),
                __app_request: actions,
                __app_store: store,
            });
        } else {
            body.append("__app_request", JSON.stringify(actions));
            if (store) {
                body.append("__app_store", JSON.stringify(store));
            }

            if (contentType === "application/x-www-form-urlencoded") {
                body = new URLSearchParams(body);
            } else {
                contentType = null;
            }
        }

        const layers = [];

        if (request.blockForm !== false && form) {
            const layer = $.create("wait-layer");

            form.appendChild(layer.get<HTMLElement>());
            layers.push(layer);
        }

        if (request.blockLayers) {
            request.blockLayers.forEach((target) => {
                const _layer = $.create("wait-layer");
                $(target).append(_layer);
                layers.push(_layer);
            });
        }

        const headers = {
            Authorization: `Bearer ${this.token}`,
            "Application-Id": this.id,
            "Application-Mode": request.mode,
            ...request.headers,
        };

        if (contentType) {
            headers["Content-Type"] = contentType;
        }

        fetch(this.server /*"http://localhost/phpserver/"*/, {
            method: "post",
            headers,
            body,
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            })
            .then((json) => {
                this.evalResponse(json);
            })
            .finally(() => {
                layers.forEach((layer) => {
                    layer.remove();
                });
            });
    }

    _createBlockLayer(source: HTMLElement | string): HTMLElement {
        let element: HTMLElement;
        if (typeof source === "string") {
            element = this.querySelector(source);
        } else {
            element = source;
        }

        const layer = $.create("wait-layer");

        element.appendChild(layer.get<HTMLElement>());

        console.log(element, layer);
        return layer.get();
    }

    _showError(error) {
        this.showMessage({
            type: "alert",
            caption: "Error!",
            delay: 5000,
            text: error,
            className: "x",
            left: "center",
            top: "20px",

            autoClose: "true",
        });
    }
}

customElements.define("sevian-app", Sevian);
