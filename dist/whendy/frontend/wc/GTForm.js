class GTLabel extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<style>
            :host {
                display:block;
				border:4px solid red;
				
             }

            
            </style>
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        //this.slot = "field";
    }
}
customElements.define("gt-label", GTLabel);
class GTCaption extends HTMLElement {
    static get observedAttributes() {
        return ["owner", "owner-attr"];
    }
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<style>
            :host {
                display:block;
				border:4px solid red;
				
             }

            
            </style>
		<slot name="icon"></slot>
        <slot></slot>	
        <slot name="ind"></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
        });
    }
    connectedCallback() {
        this.slot = "caption";
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(name, oldVal, newVal) {
    }
}
customElements.define("gt-caption", GTCaption);
class GTForm extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style>
            <slot name="caption"></slot>
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
        const selects = this.querySelectorAll("select[data-filter]");
        selects.forEach(select => {
            const options = JSON.parse(select.innerHTML);
            options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = String(option.value); // the index
                opt.innerHTML = String(option.text);
                select.append(opt);
            });
        });
        console.log(selects);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
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
}
customElements.define("gt-form", GTForm);
//# sourceMappingURL=GTForm.js.map