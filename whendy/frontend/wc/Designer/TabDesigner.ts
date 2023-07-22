import { Q as $ } from "./../../Q.js";

class TabDesigner extends HTMLElement {
    private _index = 0;
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();

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

    public connectedCallback() {
        this.setAttribute("role", "tab");

        if(!this.querySelector("item-container")){
            this.addPage({})
            
        }
        //this.slot = "container";
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {}

    public addPage(info?:any) {
        const page = $(this).create("div").addClass("tab-page");
        const head = page.create("div").addClass("head");
        const body = page.create("item-container");

        head.append(info?.caption || "Tab Page " + (this._index++).toString());
        if (info?.body) {
            body.append(info.body);
        }
    }

    get length() {
        return Array.from(this.querySelectorAll(":scope > .tab-page")).length;
    }
}

customElements.define("tab-designer", TabDesigner);