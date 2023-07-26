import { Q as $ } from "./../../Q.js";
class TabDesigner extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        this._index = 0;
        this._data = {};
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
        this.setAttribute("designer-type", "tab");
        this.setAttribute("role", "tab");
        if (!this.querySelector("item-container")) {
            this.addPage({});
        }
        //this.slot = "container";
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    addPage(info) {
        const page = $(this).create("div").addClass("tab-page");
        const head = page.create("div").addClass("caption");
        const body = page.create("item-container");
        head.append((info === null || info === void 0 ? void 0 : info.caption) || "Tab Page " + (this._index++).toString());
        if (info === null || info === void 0 ? void 0 : info.body) {
            body.append(info.body);
        }
    }
    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        }
        else {
            this.removeAttribute("caption");
        }
    }
    get caption() {
        return this.getAttribute("caption");
    }
    get length() {
        return Array.from(this.querySelectorAll(":scope > .tab-page")).length;
    }
    get designerType() {
        return this.hasAttribute("designer-type");
    }
    set dataSource(data) {
        this._data = data;
    }
    get dataSource() {
        this._data.component = "tab",
            this._data.elements = [];
        this._data.caption = this.caption;
        const pages = $(this).queryAll(":scope > .tab-page");
        pages.forEach((page) => {
            const container = page.query(":scope > item-container").get();
            const obj = {
                component: "tabpage",
                caption: page.query(":scope > .caption").text(),
                elements: [],
            };
            if (container.children.length > 0) {
                for (const node of container.children) {
                    obj.elements.push(node["dataSource"]);
                }
            }
            this._data.elements.push(obj);
        });
        return this._data;
    }
}
customElements.define("tab-designer", TabDesigner);
//# sourceMappingURL=TabDesigner.js.map