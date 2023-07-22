import { Q as $ } from "./../../Q.js";
class TabDesigner extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        this._index = 0;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            :host {
                display:block;
				border:4px solid red;
				
             }

            
            </style>
            TabDesigner
            <button class="plus">+</button>
            <slot></slot>

            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.shadowRoot.querySelector(".plus").addEventListener("click", (event) => {
            this.addPage();
            //$.fire(this, "add-tab", {});
        });
    }
    connectedCallback() {
        this.setAttribute("role", "tab");
        if (!this.querySelector("item-container")) {
            this.addPage({});
        }
        //this.slot = "container";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    addPage(info) {
        const page = $(this).create("div").addClass("tab-page");
        const head = page.create("div").addClass("head");
        const body = page.create("item-container");
        head.append((info === null || info === void 0 ? void 0 : info.caption) || "Tab Page " + (this._index++).toString());
        if (info === null || info === void 0 ? void 0 : info.body) {
            body.append(info.body);
        }
    }
    get length() {
        return Array.from(this.querySelectorAll(":scope > .tab-page")).length;
    }
}
customElements.define("tab-designer", TabDesigner);
//# sourceMappingURL=TabDesigner.js.map