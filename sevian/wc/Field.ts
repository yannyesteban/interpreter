import { Q as $ } from "../Q.js";

class RequiredInd extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
    }

    public connectedCallback() {}

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("required-ind", RequiredInd);

class DataOption extends HTMLElement {
    static get observedAttributes() {
        return ["selected", "value", "level"];
    }
    constructor() {
        super();
    }

    public connectedCallback() {
        this.slot = "data-option";
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {}

    set level(value) {
        if (Boolean(value)) {
            this.setAttribute("level", value);
        } else {
            this.removeAttribute("level");
        }
    }

    get level() {
        return this.getAttribute("level");
    }

    set value(value) {
        if (Boolean(value)) {
            this.setAttribute("value", value);
        } else {
            this.removeAttribute("value");
        }
    }

    get value() {
        return this.getAttribute("value");
    }

    set selected(value) {
        if (Boolean(value)) {
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    get selected() {
        return this.hasAttribute("selected");
    }
}
customElements.define("data-option", DataOption);

class DataEvent extends HTMLElement {
    static get observedAttributes() {
        return ["name", "value"];
    }
    constructor() {
        super();
    }

    public connectedCallback() {
        this.slot = "data-event";
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {}

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    set value(value) {
        if (Boolean(value)) {
            this.setAttribute("value", value);
        } else {
            this.removeAttribute("value");
        }
    }

    get value() {
        return this.getAttribute("value");
    }
}
customElements.define("data-event", DataEvent);

class Field extends HTMLElement {
    static get observedAttributes() {
        return ["rlabel"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:block;

			}

            :host([hidden]){
                display:none;
            }
            
			</style>
            <slot name="label"></slot>
            <slot name="ind"></slot>
            
            <slot></slot>
            <slot name="rlabel"></slot>
            <slot name="rind"></slot>
            
            `;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = <HTMLSlotElement>this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //this._load();
        });
    }

    public connectedCallback() {
        this._load();
    }

    _load() {
        const label = <HTMLElement>this.querySelector("label");
        if (label) {
            label.slot = this.rlabel ? "rlabel" : "label";
            const ind = <HTMLElement>this.querySelector("required-ind");
            if (ind) {
                ind.slot = this.rlabel ? "rind" : "ind";
            }
        }
        
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log(name, oldVal, newVal);
        switch (name) {
            case "rlabel":
                this._load();
                break;
        }
    }

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    set value(value) {
        if (Boolean(value)) {
            this.setAttribute("value", value);
        } else {
            this.removeAttribute("value");
        }
    }

    get value() {
        return this.getAttribute("value");
    }

    set input(value) {
        if (Boolean(value)) {
            this.setAttribute("input", value);
        } else {
            this.removeAttribute("input");
        }
    }

    get input() {
        return this.getAttribute("input");
    }

    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        } else {
            this.removeAttribute("type");
        }
    }

    get type() {
        return this.getAttribute("type");
    }

    set label(value) {
        if (Boolean(value)) {
            this.setAttribute("label", value);
        } else {
            this.removeAttribute("label");
        }
    }

    get label() {
        return this.getAttribute("label");
    }

    set filter(value) {
        if (Boolean(value)) {
            this.setAttribute("filter", value);
        } else {
            this.removeAttribute("filter");
        }
    }

    get filter() {
        return this.getAttribute("filter");
    }

    set hidden(value) {
        if (Boolean(value)) {
            this.setAttribute("hidden", "");
        } else {
            this.removeAttribute("hidden");
        }
    }

    get hidden() {
        return this.hasAttribute("hidden");
    }

    set rlabel(value) {
        if (Boolean(value)) {
            this.setAttribute("rlabel", "");
        } else {
            this.removeAttribute("rlabel");
        }
    }

    get rlabel() {
        return this.hasAttribute("rlabel");
    }

    setDataOption() {
        const input = this.querySelector("[data-form-type=field]");
        let options;
        if (this.filter) {
            options = this.querySelectorAll(`data-option[level=${this.filter}]`);
        } else {
            options = this.querySelectorAll("data-option");
        }

        if (this.input?.toLowerCase() === "select") {
            input.innerHTML = "";

            options.forEach((option) => {
                const opt = document.createElement("option");
                opt.value = option.getAttribute("value"); // the index
                opt.innerHTML = option.innerHTML;
                if (option.getAttribute("selected")) {
                    opt.setAttribute("selected", "");
                }

                input.append(opt);
            });
            input["value"] = this.value;
        } else {
            input.innerHTML = "";

            options.forEach((option) => {
                input.appendChild(option);
            });
        }
    }

    setDataEvent() {
        const input = this.querySelector("[data-form-type=field]");
        let events = this.querySelectorAll("data-event");
        events.forEach((item) => {
            this.addEventListener(item.getAttribute("name"), $.bind(item.textContent, this, "event"));
        });
    }
}

customElements.define("gt-field", Field);
