import { Q as $ } from "./../Q.js";
export class WHSelect extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHRadio.css">
		<select></select><slot></slot>

		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (evt) => {
            console.log("slotchange");
            let select = this.shadowRoot.querySelector('select');
            select.append(...slot.assignedNodes());
            //const nodes = slot.assignedNodes();
            //select.innerHTML = this.innerHTML; 
            select.value = this.value;
        });
    }
    connectedCallback() {
        const select = this.shadowRoot.querySelector(`select`);
        select.addEventListener("change", (event) => {
            this.value = select.value;
        });
        console.log("sconnectedCallback", this.name, this.data);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        //this[name] = newVal;
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
    set value(value) {
        if (Boolean(value)) {
            this.setAttribute("value", value);
        }
        else {
            this.removeAttribute("value");
        }
    }
    get value() {
        return this.getAttribute("value");
    }
    set data(options) {
        this.innerHTML = "";
        options.forEach(info => {
            const option = $(this).create("option");
            option.value(info[0] || "");
            option.html(info[1] || "");
            if (info[2]) {
                $(option).ds("group", info[2]);
            }
        });
    }
}
customElements.define("wh-select", WHSelect);
//# sourceMappingURL=Select.js.map