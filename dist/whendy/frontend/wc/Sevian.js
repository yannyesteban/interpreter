import { loadScript } from "./../LoadScript.js";
import { loadCss } from "./../LoadCss.js";
import { Q as $ } from "./../Q.js";
import * as wc from "./../WC.js";
class Sevian extends HTMLElement {
    static get observedAttributes() {
        return ["server"];
    }
    constructor() {
        super();
        this.panels = {};
        this._modules = [];
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;

			}
			</style><slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, old, value) {
        switch (name) {
            case "server":
                this.initApp();
                break;
        }
    }
    set server(value) {
        if (Boolean(value)) {
            this.setAttribute("server", value);
        }
        else {
            this.removeAttribute("server");
        }
    }
    get server() {
        return this.getAttribute("server");
    }
    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        }
        else {
            this.removeAttribute("name");
        }
    }
    get name() {
        return this.getAttribute("name");
    }
    set token(value) {
        if (Boolean(value)) {
            this.setAttribute("token", value);
        }
        else {
            this.removeAttribute("token");
        }
    }
    get token() {
        return this.getAttribute("token");
    }
    whenValid(name) {
        var _a, _b;
        const element = ((_b = (_a = this.modules) === null || _a === void 0 ? void 0 : _a.find((e) => e.name.toUpperCase() === name.toUpperCase())) === null || _b === void 0 ? void 0 : _b.wc) || name;
        return new Promise((resolve, reject) => {
            console.log(`%c Element: %c${element}, %s`, "color:yellow", "color:aqua", name);
            if (element.indexOf("-") < 0 || !element) {
                resolve(element);
                return;
            }
            customElements
                .whenDefined(element)
                .then((what) => {
                console.log(what);
                resolve(element);
            })
                .catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }
    setElement(info) {
        console.log("initElement", info);
        this.whenValid(info.data.element).then((element) => {
            let e = $.id(info.id);
            if (e) {
                e.remove();
            }
            e = $.create(element);
            e.id(info.id);
            e.prop(info.data.propertys);
            const panel = $(`#${info.setPanel}` || info.setTo || info.appendTo);
            if (!panel) {
                return;
            }
            if (info.setPanel || info.setTo) {
                panel.text("");
            }
            panel.append(e);
        });
    }
    updateElement(info) {
        console.log("updateElement", info, document.getElementById(info.id));
        this.whenValid(info.data.element).then(() => {
            const e = $.id(info.id);
            if (e) {
                if (info.data.propertys) {
                    e.prop(info.data.propertys);
                }
            }
        });
    }
    evalResponse(response) {
        console.log(response);
        response.forEach((r) => {
            switch (r.type) {
                case "set":
                    console.log(r);
                    this.setElement(r);
                    if (r.setPanel) {
                        this.panels[r.setPanel] = r;
                    }
                    break;
                case "element":
                    this.updateElement(r);
                    break;
            }
        });
        return true;
    }
    initApp() {
        window.history.pushState({ a: 2 }, "yanny", "?page=2");
        console.log(window.history.state);
        const request = {
            confirm: "?",
            valid: true,
            headers: {
                "Application-Name": this.name,
            },
            data: {
                id: this.id,
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
        const info = {}, store = {
            myName: "Yanny",
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
            //SID: "this.sid",
            "Application-Name": this.name,
            "Application-Mode": info.mode,
        };
        fetch(this.server, {
            method: info.method || "post",
            headers: Object.assign(Object.assign({}, headers), info.headers),
            body: JSON.stringify({ __app_request: request.actions, __app_store: store }),
        })
            .then((response) => {
            return response.json();
        })
            .catch((error) => {
            console.log(error);
        })
            .then((json) => {
            this.evalResponse(json);
        });
    }
    set cssSheets(data) {
        console.log(data);
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
    send(info) {
        const store = {
            unit: 4032,
        };
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`,
                "Application-Id": this.id,
                "Application-Mode": info.mode,
            };
            fetch(this.server, {
                method: info.method || "post",
                headers: Object.assign(Object.assign({}, headers), info.headers),
                body: JSON.stringify(Object.assign(Object.assign({}, info.body), { __app_store_: store })),
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
}
customElements.define("sevian-app", Sevian);
//# sourceMappingURL=Sevian.js.map