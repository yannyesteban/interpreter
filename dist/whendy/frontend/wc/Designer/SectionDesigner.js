import { Q as $ } from "./../../Q.js";
class SectionDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["caption"];
    }
    constructor() {
        super();
        this._index = 0;
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
        this.setAttribute("role", "tab");
        let caption = $(this).create("caption-ext");
        caption.attr("slot", "caption");
        //this.load()
        //this.slot = "container";
        if (!this.querySelector("item-container")) {
            this.appendChild(document.createElement("item-container"));
        }
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("name", name);
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
}
customElements.define("section-designer", SectionDesigner);
//# sourceMappingURL=SectionDesigner.js.map