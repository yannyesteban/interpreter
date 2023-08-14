import { Q as $ } from "./../Q.js";
import { getParentElement } from "./../Tool.js";
import "./Tab.js";
function dispatchEvent(element, eventName, detail) {
    const event = new CustomEvent(eventName, {
        detail,
        cancelable: true,
        bubbles: true
    });
    element.dispatchEvent(event);
}
class WHPageCaption extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-page-caption", WHPageCaption);
class WHPageBody extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("wh-page-body", WHPageBody);
class WHPage extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot name="caption"></slot>	
		<slot name="body"></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
    }
}
customElements.define("wh-page", WHPage);
class WHFormCaption extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-form-caption", WHFormCaption);
class WHFormBody extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("wh-form-body", WHFormBody);
class WHFormField extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            this._linkInputs();
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
    }
    _linkInputs() {
        const inputs = Array.from(this.querySelectorAll(`input,select,textarea,buttom`));
        inputs.forEach(input => {
            input.dataset["type"] = "form-input";
        });
    }
}
customElements.define("wh-form-field", WHFormField);
class WHNavButton extends HTMLElement {
    static get observedAttributes() {
        return ["caption"];
    }
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "button";
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "caption":
                this.innerHTML = newValue;
                break;
        }
    }
    set dataSource(source) {
        this.innerHTML = "";
        for (let key in source) {
            this[key] = source[key];
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
    getApp() {
        return getParentElement(this, "wh-app");
    }
    getForm() {
        return getParentElement(this, "wh-form");
    }
    set send(info) {
        $(this).on("click", (event) => {
            const app = this.getApp();
            if (app) {
                info.body = this.getForm().getValues();
                app.go(info);
            }
        });
    }
    set events(events) {
        for (let key in events) {
            $(this).on(key, $.bind(events[key], this, "event"));
        }
    }
}
customElements.define("wh-nav-button", WHNavButton);
class WHNav extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot name="button"></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "nav";
    }
    set dataSource(source) {
        this.innerHTML = "";
        if (source.buttons) {
            source.buttons.forEach(info => {
                $(this).create("wh-nav-button").prop("dataSource", info);
            });
        }
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
}
customElements.define("wh-nav", WHNav);
export class WHForm extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        this._caption = null;
        const template = document.createElement("template");
        template.innerHTML = `
		<link rel="stylesheet" href="./../sass/WHForm.css">
		<slot name="caption"></slot>
		<slot name="body"></slot>
		<slot name="nav"></slot>

		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    isValid(arg) {
        throw new Error("Method not implemented.");
    }
    connectedCallback() {
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "caption":
                break;
        }
    }
    set elements(elements) {
        elements.forEach(element => {
            this.evalElement(this._getBody(), element);
        });
    }
    addField(main, field) {
        const formField = $(main).create("wh-form-field");
        formField.addClass(field.className || null);
        let d = formField.create("label").html(field.title);
        console.log(d);
        //.attr("for", field.attr.id || null);
        const input = formField.create(field.input);
        input.prop("id", field.id);
        input.prop("name", field.name);
        if (field.defPropertys) {
            field.defPropertys.forEach(prop => {
                input.define(prop.name, prop.descriptor);
            });
        }
        if (field.data) {
            input.prop("data", field.data);
        }
        if (field.value !== undefined) {
            input.prop("value", field.value);
        }
        input.prop(field.prop);
        input.attr(field.attr);
        input.ds(field.ds || {});
        input.ds("type", "form-input");
        if (field.events) {
            for (let key in field.events) {
                input.on(key, $.bind(field.events[key], this, "event"));
            }
        }
    }
    addPage(main, info) {
        const page = $(main).create("wh-page");
        const caption = $(page).create("wh-page-caption").html(info.label);
        const body = $(page).create("wh-page-body");
        if (info.elements && Array.isArray(info.elements)) {
            info.elements.forEach(element => {
                this.evalElement(body.get(), element);
            });
        }
    }
    addFieldset(main, info) {
        const fieldset = $(main).create("fieldset");
        $(fieldset).create("legend").html(info.label);
        if (info.elements) {
            info.elements.forEach(element => {
                this.evalElement(fieldset.get(), element);
            });
        }
    }
    addTab(main, info) {
        const tab = $(main).create("wh-tab");
        info.pages.forEach(page => {
            const menu = $(tab).create("wh-tab-menu").html(page.label || null);
            const panel = $(tab).create("wh-tab-panel");
            if (page.elements) {
                page.elements.forEach(element => {
                    this.evalElement(panel.get(), element);
                });
            }
        });
    }
    evalElement(main, element) {
        console.log("Elekent ", element);
        switch (element.element) {
            case "field":
                this.addField(main, element);
                break;
            case "section":
                this.addPage(main, element);
                break;
            case "tab":
                this.addTab(main, element);
                break;
            case "fieldset":
                this.addFieldset(main, element);
                break;
        }
    }
    set dataSource(dataSource) {
        $(this).html("");
        $(this).create("wh-form-caption");
        $(this).create("wh-form-body");
        for (let k in dataSource) {
            this[k] = dataSource[k];
        }
        if (dataSource.nav) {
            $(this).create("wh-nav").prop("dataSource", dataSource.nav);
        }
    }
    set caption(value) {
        this._caption = value;
        this._setCaption(value);
    }
    get caption() {
        return this._caption;
    }
    set nav(value) {
    }
    get nav() {
        return "";
    }
    getValues() {
        const inputs = Array.from(this.querySelectorAll(`[name][data-type="form-input"]`));
        return inputs.reduce((data, e) => {
            data[e.name] = e.value;
            return data;
        }, {});
    }
    _setCaption(caption) {
        let eleCaption = $(this).query(`:scope > wh-form-caption`);
        if (!eleCaption) {
            eleCaption = $(this).create("wh-form-caption");
        }
        eleCaption.html("");
        eleCaption.append(caption);
    }
    _getBody() {
        return this.querySelector(`:scope > wh-form-body`);
    }
    valid() {
    }
}
customElements.define("wh-form", WHForm);
//# sourceMappingURL=Form.js.map