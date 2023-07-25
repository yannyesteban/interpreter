import { Q as $ } from "./../../Q.js";
const configForm = {
    label: "Section 1",
    className: "",
    name: "x",
    id: "",
};
class SectionDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["caption"];
    }
    constructor() {
        super();
        this._index = 0;
        this._data = {};
        this._win = null;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            :host {
                display:block;
				border:4px solid yellow;
				padding:4px;
				
             }

            
            </style>
            Section<head><slot name="caption"></slot></head>
            
            <slot></slot>

            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        this.setAttribute("designer-type", "section");
        this.setAttribute("role", "tab");
        let caption = $(this).create("caption-ext");
        caption.attr("target", this.tagName);
        caption.attr("slot", "caption");
        //this.load()
        //this.slot = "container";
        if (!this.querySelector(":scope > item-container")) {
            this.appendChild(document.createElement("item-container"));
        }
        if (!this.querySelector(":scope > tool-ext")) {
            this.appendChild(document.createElement("tool-ext"));
        }
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "caption":
                //this.shadowRoot.querySelector("head").innerHTML = newVal;
                break;
        }
    }
    load() {
        const body = $(this).create("item-container");
        //head.text(this.caption);
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
        this._data.elements = [];
        this._data.caption = this.caption;
        const container = $(this).query(":scope > item-container").get();
        if (container.children.length > 0) {
            for (const node of container.children) {
                this._data.elements.push(node["dataSource"]);
            }
        }
        return this._data;
    }
    showConfig() {
        if (!this._win) {
            console.log(1111);
            const win = $.create("wh-win").get();
            console.log(win);
            const header = $(win).create("wh-win-header");
            win.setAttribute("mode", "auto");
            win.setAttribute("top", "10px");
            win.setAttribute("left", "10px");
            header.create("wh-win-caption").html(this.caption);
            const body = $(win).create("wh-win-body");
            $(document.body).append(win);
            this._win = win;
            return;
        }
        console.log(this._win);
        this._win.setAttribute("visibility", "visible");
    }
}
customElements.define("section-designer", SectionDesigner);
//# sourceMappingURL=SectionDesigner.js.map