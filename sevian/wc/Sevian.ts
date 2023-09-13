import * as Eval from "./../Eval.js";
import { loadScript } from "./../LoadScript.js";
import { loadCss } from "./../LoadCss.js";

import { Q as $ } from "./../Q.js";
import * as wc from "./../WC.js";
import { AppRequest, ElementResponse, FetchInfo, IElement, IResponse } from "../IApp.js";
import "./AppRequest.js";

export class Sevian extends HTMLElement {
    private panels: any = {};
    private _modules: wc.WCModule[] = [];

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

    public connectedCallback() {
        this.classList.add("_main_app_");
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
            if(!name){

                reject()
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
        await this.whenValid(info.element).then((element) => {
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
            }

            //const panel = $(`#${info.panel}` || info.setTo || info.appendTo);

            if (!panel) {
                return;
            }

            if (info.panel || info.setTo) {
                panel.text("");
            }
            panel.append(e);
        }).catch(error=>{
            console.log("element not found");
        });
    }

    async updateElement(info) {
        await this.whenValid(info.element).then(() => {
            const e = $.id(info.id);

            if (e) {
                if (info.propertys) {
                    e.prop(info.propertys);
                }
            }
        }).catch(error=>{
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
                    left:"center",
                    top:"20px",
                    
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

    showMessage(message){
        const popup = $(this).findOrCreate("ss-popup", "ss-popup").get<any>();
        popup.dataSource = message
        popup.mode = "open"
    }

    evalExp(obj, data){

        const str = Eval.evalAll(JSON.stringify(obj), {...this.getStore(), ...data });

        if(str){
            return JSON.parse(str);
        }

        return obj;
        


    }

    send(request: AppRequest, masterData?: any) {

        if(masterData){
            request = this.evalExp(request, masterData);
        }

        if (request.validate && typeof request.validate === "function" && !request.validate()) {
            return;
        } else if (request.validate && typeof request.validate === "string") {
            const element: any = $(request.validate).get();
            if (typeof element.valid === "function" && !element.valid()) {
                return;
            }
        } else if (typeof request.validate === "object" && "valid" in request.validate && !request.validate?.valid()) {
            return;
        }

        if (request.confirm && !window.confirm(request.confirm)) {
            return;
        }

        let form: HTMLFormElement = null;

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
}

customElements.define("sevian-app", Sevian);
