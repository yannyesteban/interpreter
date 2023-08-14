var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                console.log(this._modules, (_a = this.modules) === null || _a === void 0 ? void 0 : _a.find((e) => e.name.toUpperCase() === name.toUpperCase()));
                const element = ((_c = (_b = this.modules) === null || _b === void 0 ? void 0 : _b.find((e) => e.name.toUpperCase() === name.toUpperCase())) === null || _c === void 0 ? void 0 : _c.wc) || name;
                console.log(`%c Element: %c${element}, %s`, "color:yellow", "color:aqua", name);
                if (element.indexOf("-") < 0 || !element) {
                    resolve(element);
                    return;
                }
                yield customElements
                    .whenDefined(element)
                    .then((what) => {
                    console.log(what);
                    resolve(element);
                })
                    .catch((error) => {
                    console.log(error);
                    reject(error);
                });
            }));
        });
    }
    setElement(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.whenValid(info.data.element).then((element) => {
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
        });
    }
    updateElement(info) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updateElement", info, document.getElementById(info.id));
            yield this.whenValid(info.data.element).then(() => {
                const e = $.id(info.id);
                if (e) {
                    if (info.data.propertys) {
                        e.prop(info.data.propertys);
                    }
                }
            });
        });
    }
    evalResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(response);
            for (const r of response) {
                console.log(r);
                switch (r.type) {
                    case "set":
                        yield this.setElement(r);
                        if (r.setPanel) {
                            this.panels[r.setPanel] = r;
                        }
                        break;
                    case "element":
                        yield this.updateElement(r);
                        break;
                }
            }
            ;
            return true;
        });
    }
    initApp() {
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
        console.log("%c%s", "color:yellow", info);
        this._modules = info;
        wc.LoadModules(info);
    }
    get modules() {
        return this._modules;
    }
    getStore() {
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
    send(request) {
        var _a;
        if (request.validate && typeof request.validate === "function" && !request.validate()) {
            return;
        }
        else if (request.validate && typeof request.validate === "string") {
            const element = $(request.validate).get();
            if (typeof element.valid === "function" && !element.valid()) {
                return;
            }
        }
        else if (typeof request.validate === "object" && "valid" in request.validate && !((_a = request.validate) === null || _a === void 0 ? void 0 : _a.valid())) {
            return;
        }
        if (request.confirm && !window.confirm(request.confirm)) {
            return;
        }
        let form = null;
        if (typeof request.form === "string") {
            form = $(request.form).get();
        }
        else if (request.form instanceof HTMLFormElement) {
            form = request.form;
        }
        else if (request.form instanceof HTMLElement) {
            form = request.form.closest("form");
        }
        if (form && request.reportValidity && !form.reportValidity()) {
            return;
        }
        let body;
        let actions = request.actions || [];
        let store = {};
        const _store = this.getStore();
        if (form) {
            body = new FormData(form);
        }
        else {
            body = new FormData();
        }
        if (request.store === true) {
            store = _store;
        }
        else if (Array.isArray(request.store)) {
            store = request.store.reduce((store, e) => ((store[e] = _store[e]), store), {});
        }
        else if (typeof request.store === "object") {
            store = typeof request.store;
        }
        let contentType = request.contentType === undefined ? "application/json" : request.contentType;
        if (contentType === "application/json") {
            body = JSON.stringify(Object.assign(Object.assign({}, Object.fromEntries(body.entries())), { __app_request: actions, __app_store: store }));
        }
        else {
            body.append("__app_request", JSON.stringify(actions));
            if (store) {
                body.append("__app_store", JSON.stringify(store));
            }
            if (contentType === "application/x-www-form-urlencoded") {
                body = new URLSearchParams(body);
            }
            else {
                contentType = null;
            }
        }
        const layers = [];
        if (request.blockForm !== false && form) {
            const layer = $.create("wait-layer");
            form.appendChild(layer.get());
            layers.push(layer);
        }
        if (request.blockLayers) {
            request.blockLayers.forEach((target) => {
                const _layer = $.create("wait-layer");
                $(target).append(_layer);
                layers.push(_layer);
            });
        }
        const headers = Object.assign({ Authorization: `Bearer ${this.token}`, "Application-Id": this.id, "Application-Mode": request.mode }, request.headers);
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
//# sourceMappingURL=Sevian.js.map