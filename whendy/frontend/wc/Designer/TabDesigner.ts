import { Q as $ } from "./../../Q.js";

class TabDesigner extends HTMLElement {
    private _index = 0;
    private _data: any = {};
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
            Tab Section<head><slot name="caption"></slot></head>
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
        this.setAttribute("designer-type", "tab");
        this.setAttribute("role", "tab");


        const caption = $(this).create("caption-ext");
        caption.attr("target", this.tagName);
        caption.attr("slot", "caption");
        caption.html(this.caption);

        if (!this.querySelector("item-container")) {
            this.addPage({});
        }
        //this.slot = "container";
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}

    public addPage(info?: any) {
        const page = $(this).create("div").addClass("tab-page");

        const caption = page.create("caption-ext");
        caption.attr("target", this.tagName);
        caption.attr("slot", "caption");
        //caption.html(this.caption);

        //const head = page.create("div").addClass("caption");
        const body = page.create("item-container");

        caption.html(info?.caption || "Tab Page " + (this._index++).toString());
        if (info?.body) {
            body.append(info.body);
        }
    }

    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        } else {
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
        this._data.caption =  $(this).query(":scope > caption-ext").html();

        const pages = $(this).queryAll(":scope > .tab-page");

        pages.forEach((page) => {
            const container = page.query(":scope > item-container").get<HTMLElement>();

            const obj = {
                component: "tabpage",
                label: page.query(":scope > caption-ext").text(),
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
