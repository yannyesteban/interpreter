import { Q as $ } from "../Q.js";
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
        return ["type"];
    }
    constructor() {
        super();
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
        if (event.type == "click") {
            const target = event.target.closest("button[data-nav-button]");
            if (target === null || target === void 0 ? void 0 : target.dataset.action) {
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
    set dataSource(source) {
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
                button.on(event, $.bind(fn, this.parentElement));
            }
        }
        if (info.request) {
            button.ds("request", JSON.stringify(info.request));
        }
    }
}
customElements.define("ss-nav", Nav);
//# sourceMappingURL=Nav.js.map