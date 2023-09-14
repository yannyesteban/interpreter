import { Q as $ } from "../Q.js";
class FButton extends HTMLButtonElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = "Esteban";
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type1(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type1() {
        return this.getAttribute("type");
    }
    set request(value) {
        if (Boolean(value)) {
            this.setAttribute("request", value);
        }
        else {
            this.removeAttribute("request");
        }
    }
    get request() {
        return this.getAttribute("request");
    }
    set dataSource(source) { }
}
customElements.define("f-button", FButton, { extends: "button" });
class NavButton extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set request(value) {
        if (Boolean(value)) {
            this.setAttribute("request", value);
        }
        else {
            this.removeAttribute("request");
        }
    }
    get request() {
        return this.getAttribute("request");
    }
    set dataSource(source) { }
}
customElements.define("ss-nav-button", NavButton);
class Nav extends HTMLElement {
    static get observedAttributes() {
        return ["context"];
    }
    constructor() {
        super();
        this._internals = this.attachInternals();
        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
			<style>
			:host {
				display:flex;

			}
            ::slotted(ss-nav-button){
                padding:2px;
                border:1px solid gray;
                font-size:1em;
                line-height:1em;
                vertical-align:middle;
               
                
            }
			</style><slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    handleEvent(event) {
        var _a;
        if (event.type == "click") {
            const target = event.target.closest("button[data-nav-button]");
            if (target === null || target === void 0 ? void 0 : target.dataset.action) {
                if ((_a = this.context) === null || _a === void 0 ? void 0 : _a.sendRequest) {
                    console.log("action is", target.dataset.action);
                    this._context.sendRequest(target.dataset.action);
                    return;
                }
                const customEvent = new CustomEvent("do-action", {
                    detail: {
                        action: target.dataset.action,
                    },
                    cancelable: true,
                    bubbles: true,
                });
                this.dispatchEvent(customEvent);
            }
            if (target === null || target === void 0 ? void 0 : target.dataset.request) {
                const customEvent = new CustomEvent("do-request", {
                    detail: {
                        request: target.dataset.request,
                    },
                    cancelable: true,
                    bubbles: true,
                });
                this.dispatchEvent(customEvent);
            }
        }
    }
    connectedCallback() {
        $(this).on("click", this);
    }
    disconnectedCallback() {
        $(this).off("click", this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "context":
                if (newValue) {
                    this._context = this.closest(newValue);
                }
                break;
        }
    }
    get form() {
        return this._internals.form;
    }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set context(value) {
        if (typeof value === "string") {
            this.setAttribute("context", value);
        }
        else if (value instanceof HTMLElement) {
            this._context = value;
            this.setAttribute("context", "");
        }
    }
    get context() {
        return this._context || this;
    }
    set dataSource(source) {
        if (source.context) {
            this.context = source.context;
        }
        if (source.elements) {
            for (const item of source.elements) {
                this.createElement(item);
            }
        }
    }
    createElement(info) {
        const button = $(this)
            .create("button")
            .attr("type", "button")
            .addClass(info.className)
            .ds("navButton", "")
            .ds("action", info.action || "")
            .html(info.label);
        if (info.events) {
            for (const [event, fn] of Object.entries(info.events)) {
                button.on(event, $.bind(fn, this.context));
            }
        }
        if (info.request) {
            button.ds("request", JSON.stringify(info.request));
        }
    }
}
Nav.formAssociated = true;
customElements.define("ss-nav", Nav);
//# sourceMappingURL=Nav.js.map