import { Q as $, QElement } from "../Q.js";

class FButton extends HTMLButtonElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
    }

    public connectedCallback() {
        this.innerHTML = "Esteban";
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}

    set type1(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        } else {
            this.removeAttribute("type");
        }
    }

    get type1() {
        return this.getAttribute("type");
    }

    set request(value) {
        if (Boolean(value)) {
            this.setAttribute("request", value);
        } else {
            this.removeAttribute("request");
        }
    }

    get request() {
        return this.getAttribute("request");
    }

    set dataSource(source) {}
}

customElements.define("f-button", FButton, { extends: "button" });

class NavButton extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
    }

    public connectedCallback() {}

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}

    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        } else {
            this.removeAttribute("type");
        }
    }

    get type() {
        return this.getAttribute("type");
    }

    set request(value) {
        if (Boolean(value)) {
            this.setAttribute("request", value);
        } else {
            this.removeAttribute("request");
        }
    }

    get request() {
        return this.getAttribute("request");
    }

    set dataSource(source) {}
}

customElements.define("ss-nav-button", NavButton);

class Nav extends HTMLElement {
    static formAssociated = true;
    private _internals: ElementInternals;
    private _context: any;
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
        if (event.type == "click") {
            const target: HTMLElement = event.target.closest("button[data-nav-button]");

            if (target?.dataset.action) {
                $(this).fire("app-action", { action: target?.dataset.action });
                return;
            }
            return ;
            if (target?.dataset.action) {
                if (this.context?.sendRequest) {
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
            if (target?.dataset.request) {
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

    public connectedCallback() {
        $(this).on("click", this);
    }

    public disconnectedCallback() {
        $(this).off("click", this);
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
        } else {
            this.removeAttribute("type");
        }
    }

    get type() {
        return this.getAttribute("type");
    }

    set context(value: any) {
        if (typeof value === "string") {
            this.setAttribute("context", value);
        } else if (value instanceof HTMLElement) {
            this._context = value;
            this.setAttribute("context", "");
        }
    }

    get context() {
        if (this.getAttribute("context")) {
            return this.getAttribute("context");
        }
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
            .attr("ss-action", info.action || "")
            .attr("ss-trigger", info.trigger || "click")
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

customElements.define("ss-nav", Nav);
