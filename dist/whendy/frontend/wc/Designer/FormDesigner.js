import { Q as $ } from "./../../Q.js";
class JsonImport {
    toJson(conatiner) {
        const obj = {};
        if (conatiner.children.length > 0) {
            const elems = conatiner.children;
            obj.children = [];
            for (const childNode of conatiner.children) {
                const type = childNode.getAttribute("designer-type");
                obj.children.push(childNode["info"]);
            }
        }
    }
}
class FieldDesigner {
}
class FormDesigner extends HTMLElement {
    constructor() {
        super();
        this.defaultName = "field_";
        this._index = 0;
        this._last = null;
        this._active = null;
        this._data = {};
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
            .trash{
                display:inline-block;
                width:60px;
                height:1rem;
                border:1px dotted red;
                
            }
			</style>
			<div class="header">Designer: <slot name="caption"></slot></div>
            <nav>
                
                <button class="download">Download</button>
                <button class="add">+</button>
                <button class="del">-</button>
                <button class="section">G</button>
                <button class="tab">T</button>
                <div class="trash caption"></div>
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
        this.shadowRoot.querySelector(".trash").addEventListener("drag", (event) => {
            event.preventDefault();
        });
        this.shadowRoot.querySelector(".trash").addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const items = this.getItems();
            if (items) {
                items.forEach((item) => {
                    item.remove();
                });
            }
        });
        this.shadowRoot.querySelector(".trash").addEventListener("dragover", (event) => {
            this.style.border = "2px solid orange";
            event.preventDefault();
        });
        this.shadowRoot.querySelector(".download").addEventListener("click", (event) => {
            console.log(this.dataSource);
        });
    }
    static get observedAttributes() {
        return ["caption"];
    }
    connectedCallback() {
        this.setAttribute("role", "designer");
        const ele = document.createElement("last-active-ext");
        ele.setAttribute("container", "[role=container]");
        ele.setAttribute("designer", "[role=designer]");
        this.appendChild(ele);
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
        const tool1 = {
            caption: "tool",
            items: [
                {
                    title: "Tab Container",
                    element: "tab-designer",
                    text: "Tab",
                    className: "",
                },
                {
                    title: "Section",
                    element: "section-designer",
                    text: "Section",
                    className: "",
                },
                {
                    title: "Field",
                    element: "field-designer",
                    text: "Field",
                    className: "",
                },
                {
                    title: "Separator",
                    element: "hr",
                    text: "Separator",
                    className: "",
                },
                {
                    title: "Button",
                    element: "button-designer",
                    text: "Button",
                    className: "",
                    attr: {
                        role: "button",
                    },
                    prop: {
                        innerHTML: "BUTTON",
                    },
                },
                {
                    title: "Request",
                    element: "button-designer",
                    text: "Request",
                    className: "",
                    attr: {
                        role: "button-request",
                    },
                    prop: {
                        innerHTML: "Request",
                    },
                },
            ],
        };
        let caption = $(this).create("caption-ext");
        caption.attr("target", this.tagName);
        caption.attr("slot", "caption");
        const trash = $(this).create("div");
        trash.text("xxxxxxx");
        trash.on("drag", (event) => {
            event.preventDefault();
        });
        trash.on("drop", (event) => {
            event.target.remove();
        });
        const container = $(this).create("item-container").get();
        const tool = $(this).create("tool-box").get();
        tool.dataSource = tool1;
        /*const tabButton = $(tool).create("tool-item");
        tabButton.text("Tab");
        tabButton.on("dragstart", (event) => {
            event.stopPropagation();
            event.dataTransfer.dropEffect = "copy";
            console.log("hello");
            const ele = $.create("tab-designer").get<any>();
            ele.addPage({});
            this.setItems([ele]);
        });

        const sectionBtn = $(tool).create("tool-item");
        sectionBtn.text("SEC");
        let i = 1;
        sectionBtn.on("dragstart", (event) => {
            event.stopImmediatePropagation();
            event.dataTransfer.dropEffect = "move";
            console.log("hello");
            const ele = $.create("section-designer");

            ele.attr("index", i);
            ele.text("Page " + i++);
            this.setItems([ele.get<HTMLElement>()]);
            ele.create("item-container");
        });

        const fieldBtn = $(tool).create("tool-item");
        fieldBtn.text("F");
        let j = 1;
        fieldBtn.on("click", (event) => {
            
            const ele = $.create("field-designer");

            //ele.attr("index", j)
            //ele.text("Page "+j++)
            const active = this.getActive();
            if(active){
                console.log("si", active)
                active.appendChild(ele.get<HTMLElement>());
            }else{
                container.appendChild(ele.get<HTMLElement>());
            }
            //ele.create("item-container");
        });
        fieldBtn.on("dragstart", (event) => {
            event.stopImmediatePropagation();
            event.dataTransfer.dropEffect = "move";
            console.log("hello");
            const ele = $.create("field-designer");

            //ele.attr("index", j)
            //ele.text("Page "+j++)
            
            this.setItems([ele.get<HTMLElement>()]);
            //ele.create("item-container");
        });

        const separatorBtn = $(tool).create("tool-item");
        separatorBtn.text("S");

        separatorBtn.on("dragstart", (event) => {
            event.stopImmediatePropagation();
            event.dataTransfer.dropEffect = "move";

            const ele = $.create("hr");

            this.setItems([ele.get<HTMLElement>()]);
            //ele.create("item-container");
        });
        */
    }
    setItems(items) {
        if (items && items[0].selected) {
            this._items = Array.from(this.querySelectorAll("[selected]"));
            return;
        }
        this._items = items;
    }
    getItems() {
        return this._items;
    }
    setActive(container) {
        console.log("ACTIVE", container);
        this._active = container;
    }
    getActive() {
        console.log("get ACTIVE");
        return this._active || $(this).query("item-container").get();
    }
    get fields() {
        return Array.from(this.querySelectorAll("field-designer"));
    }
    get designerType() {
        return this.hasAttribute("designer-type");
    }
    set dataSource(data) {
        this._data = data;
    }
    get dataSource() {
        this._data.elements = [];
        const container = $(this).query("item-container").get();
        if (container.children.length > 0) {
            for (const node of container.children) {
                this._data.elements.push(node["dataSource"]);
            }
        }
        return this._data;
    }
}
customElements.define("form-designer", FormDesigner);
//# sourceMappingURL=FormDesigner.js.map