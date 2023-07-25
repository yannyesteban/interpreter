import { Q as $ } from "./../../Q.js";
class ToolItem extends HTMLElement {
    static get observedAttributes() {
        return ["element"];
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
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set element(value) {
        if (Boolean(value)) {
            this.setAttribute("element", value);
        }
        else {
            this.removeAttribute("element");
        }
    }
    get element() {
        return this.getAttribute("element");
    }
    set dataSource(data) {
        this._info = data;
        this.element = data.element;
        this.title = data.title;
        this.innerHTML = data.text;
        //$(this).create("div").text(data.text);
    }
    get info() {
        return this._info;
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
        $(this).on("click", (event) => {
            console.log(event.target);
            if (event.target.tagName !== "TOOL-ITEM") {
                return;
            }
            const container = this.getDesigner().getActive();
            container.appendChild(this.createElement(event.target));
        });
        $(this).on("dragstart", (event) => {
            event.stopPropagation();
            event.dataTransfer.dropEffect = "move";
            this.getDesigner().setItems([this.createElement(event.target)]);
        });
    }
    connectedCallback() {
        this.slot = "toolbox";
        this.setAttribute("role", "toolbox");
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set dataSource(data) {
        data.items.forEach((item) => {
            $(this).create("tool-item").prop("dataSource", item);
        });
    }
    getDesigner() {
        return this.closest("[role=designer]");
    }
    createElement(item) {
        const ele = $.create(item.element).get();
        if (item.info.attr) {
            for (const [key, value] of Object.entries(item.info.attr)) {
                ele.setAttribute(key, value.toString());
            }
        }
        if (item.info.prop) {
            for (const [key, value] of Object.entries(item.info.prop)) {
                ele[key] = value;
            }
        }
        return ele;
    }
}
customElements.define("tool-box", ToolBox);
//# sourceMappingURL=Toolbox.js.map