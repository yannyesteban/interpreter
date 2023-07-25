class ButtonDesigner extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        this._data = {};
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style><button><slot>AA</slot></button>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        this.setAttribute("designer-type", "button");
        this.setAttribute("role", "button");
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
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
    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        }
        else {
            this.removeAttribute("name");
        }
    }
    get name() {
        return this.getAttribute("name");
    }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    get designerType() {
        return this.hasAttribute("designer-type");
    }
    set dataSource(data) {
        this._data = data;
    }
    get dataSource() {
        this._data.element = "button";
        this._data.name = this.name;
        this._data.caption = this.innerHTML;
        this._data.type = this.type;
        return this._data;
    }
}
customElements.define("button-designer", ButtonDesigner);
//# sourceMappingURL=ButtonDesigner.js.map