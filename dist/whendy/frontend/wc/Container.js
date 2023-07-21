import { Q as $ } from "./../Q.js";
class Container extends HTMLElement {
    static get observedAttributes() {
        return ["selected"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<style>
			:host {
				display:block;
				border:4px solid green;
				min-height:20px;
				padding:6px;
			}
		</style>
		
		<slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            console.log("assignedNodes", slot.assignedNodes());
            slot.assignedNodes().forEach((node) => {
                console.log("**************", node);
                if (node.draggable) {
                    return;
                }
                node.draggable = true;
                $(node).on("dragstart", event => {
                    event.stopPropagation();
                    console.log("START....", node);
                    event.dataTransfer.dropEffect = "move";
                    this.setItems([node]);
                });
            });
        });
        this.addEventListener("focus", (event) => {
            this.selected = true;
        });
        this.addEventListener("blur", (event) => {
            this.selected = false;
        });
        this.addEventListener("dragover", (event) => {
            this.style.border = "2px solid orange";
            event.preventDefault();
        });
        this.addEventListener("dragleave", (event) => {
            this.style.border = "";
            event.preventDefault();
        });
        this.addEventListener("drop", (event) => {
            console.log(event, event.target.tagName);
            event.preventDefault();
            event.stopImmediatePropagation();
            const items = this.getItems(event.dataTransfer);
            if (!items) {
                return;
            }
            let beforeOf = null;
            if (event.target != this) {
                const rect = event.target.getBoundingClientRect();
                const diff = event.clientY - rect.top;
                if (diff > rect.height / 2) {
                    beforeOf = event.target.nextSibling;
                }
                else {
                    beforeOf = event.target;
                }
            }
            console.log(items);
            this.style.border = "4px solid purple";
            if (beforeOf) {
                items.forEach((item) => event.target.parentNode.insertBefore(item, beforeOf));
            }
            else {
                items.forEach((item) => this.appendChild(item));
            }
            this.setItems(null);
        });
    }
    connectedCallback() {
        //this.slot = "container";
        this.setAttribute("role", "container");
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    set selected(value) {
        value = Boolean(value);
        if (value) {
            this.setAttribute("selected", "");
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.hasAttribute("selected");
    }
    getItems(data) {
        const parent = this.closest("[role=designer]");
        if ("getItems" in parent) {
            console.log(parent.getItems());
            return parent.getItems();
        }
        return null;
    }
    ;
    setItems(items) {
        const parent = this.closest("[role=designer]");
        if ("setItems" in parent) {
            return parent.setItems(items);
        }
        return null;
    }
    ;
}
customElements.define("item-container", Container);
class ToolItem extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style><button><slot></slot></button>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        this.draggable = true;
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
}
customElements.define("tool-item", ToolItem);
class ToolBox extends HTMLElement {
    static get observedAttributes() {
        return [""];
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
    connectedCallback() {
        this.slot = "toolbox";
        this.setAttribute("role", "toolbox");
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
}
customElements.define("tool-box", ToolBox);
class FieldDesigner {
}
class FormDesigner extends HTMLElement {
    constructor() {
        super();
        this.defaultName = "field_";
        this._index = 0;
        this._last = null;
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;
                padding:10px;
                height:auto;
				border:4px solid red;
				
				
			}

			:host:not(:defined) {
				display:none;
				
			}
            nav{
                display:inline-flex;
            }
			.table-menu{
				border:1px solid red;
			}
            .fields{
                margin:20px;
            }

            button{
                display:inline-block;
                margin:0px;
            }

            [contenteditable=true]{
                background-color:black;
            }

            wh-tab-menu {
                max-width: 120px;
            }
			</style>
			<div class="header">Designer: <span class="caption"></span></div>
            <nav>
                <button class="add">+</button>
                <button class="del">-</button>
                <button class="section">G</button>
                <button class="tab">T</button>
            </nav>
			<div class="fields"><slott></slott></div>
            <div class="container"></div>
			<div class="table-menu">
            <slot></slot>
			<slot name="toolbox"></slot>
            <slot name="table-menu"></slot></div>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.iCaption = this.shadowRoot.querySelector(".caption");
        this.iSection = this.shadowRoot.querySelector(".section");
        this.iTab = this.shadowRoot.querySelector(".tab");
    }
    static get observedAttributes() {
        return ["caption"];
    }
    connectedCallback() {
        this.setAttribute("role", "designer");
        this.load();
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "caption":
                this.iCaption.innerHTML = newValue;
                break;
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
    load() {
        $(this).create("item-container");
        const tool = $(this).create("tool-box");
        const tabButton = $(tool).create("tool-item");
        tabButton.text("Tab");
        tabButton.on("dragstart", event => {
            event.stopPropagation();
            event.dataTransfer.dropEffect = "copy";
            console.log("hello");
            const ele = $.create("tab-designer").get();
            ele.addPage({});
            this.setItems([ele]);
        });
        const sectionBtn = $(tool).create("tool-item");
        sectionBtn.text("SEC");
        let i = 1;
        sectionBtn.on("dragstart", event => {
            event.stopImmediatePropagation();
            event.dataTransfer.dropEffect = "move";
            console.log("hello");
            const ele = $.create("section-designer");
            ele.attr("index", i);
            ele.text("Page " + i++);
            this.setItems([ele.get()]);
            ele.create("item-container");
        });
    }
    setItems(items) {
        this._items = items;
    }
    getItems() {
        return this._items;
    }
}
customElements.define("form-designer", FormDesigner);
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
            this.addPage({});
            //$.fire(this, "add-tab", {});
        });
    }
    connectedCallback() {
        this.setAttribute("role", "tab");
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
        head.append(info.caption || "Tab Page " + (this._index++).toString());
        if (info.body) {
            body.append(info.body);
        }
    }
    get length() {
        return Array.from(this.querySelectorAll(":scope > .tab-page")).length;
    }
}
customElements.define("tab-designer", TabDesigner);
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
            Section<head></head>
            
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
        //this.load()
        //this.slot = "container";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("name", name);
        switch (name) {
            case "caption":
                this.shadowRoot.querySelector("head").innerHTML = newVal;
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
//# sourceMappingURL=Container.js.map