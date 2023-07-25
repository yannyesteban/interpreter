class DataOption extends HTMLElement {
    static get observedAttributes() {
        return ["selected", "value", "level"];
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "data-option";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    set level(value) {
        if (Boolean(value)) {
            this.setAttribute("level", value);
        }
        else {
            this.removeAttribute("level");
        }
    }
    get level() {
        return this.getAttribute("level");
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
    set selected(value) {
        if (Boolean(value)) {
            this.setAttribute("selected", "");
        }
        else {
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
    connectedCallback() {
        this.slot = "data-event";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
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
}
customElements.define("data-event", DataEvent);
class Field extends HTMLElement {
    static get observedAttributes() {
        return ["required", "label", "input", "type", "options", "rules", "placeholder", "rlabel",
            "value", "filter"];
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
            .data-option, .data-event{
                display:none;
            }
			</style>
            <slot name="label"></slot>
            <slot name="ind"></slot>
            
            <slot></slot>
            <slot name="rlabel"></slot>
            <slot name="rind"></slot>
            <slot class="data-option" name="data-option"></slot>
            <slot class="data-event" name="data-event"></slot>
            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot.data-option");
        slot.addEventListener("slotchange", (e) => {
            this.setDataOption();
            //const nodes = slot.assignedNodes();
        });
        const slot2 = this.shadowRoot.querySelector("slot.data-event");
        slot2.addEventListener("slotchange", (e) => {
            //this.setDataOption();
            console.log(this.innerHTML);
            const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        console.log("connectedCallback");
        let input;
        let id = "field-element-" + (this.id || this.name);
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.slot = this.rlabel ? "rlabel" : "label";
        label.innerHTML = this.label;
        this.appendChild(label);
        if (this.input) {
            input = document.createElement(this.input);
            if (this.type) {
                input.setAttribute("type", this.type);
            }
        }
        else {
            input = document.createElement("input");
            input.setAttribute("type", "text");
        }
        if (this.required) {
            const ind = document.createElement("span");
            ind.slot = label.slot = this.rlabel ? "rind" : "ind";
            ind.innerHTML = "*";
            this.appendChild(ind);
        }
        input.id = id;
        input.setAttribute("data-form-type", "field");
        this.appendChild(input);
        this.setDataOption();
        input["value"] = this.value;
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) {
        //console.log("attributeChangedCallback", name, oldVal, newVal);
        switch (name) {
            case "value":
                const input = this.querySelector("[data-form-type=field]");
                if (input) {
                    input["value"] = this.value;
                }
                break;
            case "filter":
                this.setDataOption();
        }
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
    set input(value) {
        if (Boolean(value)) {
            this.setAttribute("input", value);
        }
        else {
            this.removeAttribute("input");
        }
    }
    get input() {
        return this.getAttribute("input");
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
    set label(value) {
        if (Boolean(value)) {
            this.setAttribute("label", value);
        }
        else {
            this.removeAttribute("label");
        }
    }
    get label() {
        return this.getAttribute("label");
    }
    set filter(value) {
        if (Boolean(value)) {
            this.setAttribute("filter", value);
        }
        else {
            this.removeAttribute("filter");
        }
    }
    get filter() {
        return this.getAttribute("filter");
    }
    set required(value) {
        if (Boolean(value)) {
            this.setAttribute("required", "");
        }
        else {
            this.removeAttribute("required");
        }
    }
    get required() {
        return this.hasAttribute("required");
    }
    set rlabel(value) {
        if (Boolean(value)) {
            this.setAttribute("rlabel", "");
        }
        else {
            this.removeAttribute("rlabel");
        }
    }
    get rlabel() {
        return this.hasAttribute("rlabel");
    }
    setDataOption() {
        var _a;
        const input = this.querySelector("[data-form-type=field]");
        let options;
        if (this.filter) {
            options = this.querySelectorAll(`data-option[level=${this.filter}]`);
        }
        else {
            options = this.querySelectorAll("data-option");
        }
        if (((_a = this.input) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "select") {
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
        }
        else {
            input.innerHTML = "";
            options.forEach((option) => {
                input.appendChild(option);
            });
        }
    }
}
customElements.define("gt-field", Field);
//# sourceMappingURL=Field.js.map