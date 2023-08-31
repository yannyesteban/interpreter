import { Q as $, QElement } from "../Q.js";

class Nav extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() {
        $(this).on("click", (event) => {
            const target: HTMLElement = event.target;
            if (target.dataset.action) {
                const customEvent = new CustomEvent("do-action", {
                    detail: {
                        action: target.dataset.action,
                    },
                    cancelable: true,
                    bubbles: true,
                });
                this.dispatchEvent(customEvent);
            }
        });
    }

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

    set dataSource(source) {
        if (source.elements) {
            for (const item of source.elements) {
                this.createElement(item);
            }
        }
    }

    createElement(info) {
        switch (info.type) {
            case "button":
                $(this)
                    .create("button")
                    .attr("type", "button")
                    .addClass(info.className)
                    .ds("action", info.action)
                    .html(info.label);
        }
    }
}

customElements.define("ss-nav", Nav);
