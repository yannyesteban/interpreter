import { Q as $ } from "../Q.js";

class FormContainer extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";

        const template = document.createElement("template");

        template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHForm.css">
		<slot></slot>	
	
		`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    public connectedCallback() {}
}
customElements.define("form-container", FormContainer);

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
    public connectedCallback() {
        //this.slot = "field";
    }
}
customElements.define("gt-label", GTLabel);

class GTCaption extends HTMLElement {
    _observer;
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
				
				
             }

            
            </style>
		<slot name="icon"></slot>
        <slot></slot>	
        <slot name="ind"></slot>
	
		`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {});
    }

    public connectedCallback() {
        this.slot = "caption";
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}
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
				display:block;

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

    public connectedCallback() {
        const selects = this.querySelectorAll("select[data-filter]");

        selects.forEach((select) => {
            const options = JSON.parse(select.innerHTML);

            options.forEach((option) => {
                const opt = document.createElement("option");
                opt.value = String(option.value); // the index
                opt.innerHTML = String(option.text);

                select.append(opt);
            });
        });

        console.log(selects);
        this.initList();
    }

    initList(){
        const sel = this.querySelectorAll("select[list]");
        sel.forEach(select=>{
            const listName = select.getAttribute("list");
            const list = this.querySelector(`datalist[id=${listName}]`);
            const options = list.querySelectorAll("option");
            options.forEach((option) => {
                const opt = document.createElement("option");
                opt.value = String(option.value); // the index
                opt.innerHTML = String(option.text);

                select.append(opt);
            });

        })
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
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

    set dataSource(source) {
        this.innerHTML = "";
        console.log(source);

        if(source.caption){
            this._createCaption(source.caption);
        }
        
        if(source.className){
            $(this).addClass(source.className);
        }


        this.setElements(this, source.elements);
    }

    _createCaption(value){
        $(this).create("gt-caption").html(value);

    }
    setElements(parent, elements) {
        console.log(parent, elements);
        elements.forEach((element) => {
            const component = this.createElement(element);
            if (component) {
                parent.appendChild(component);
            } else {
                throw new Error("component not found!");
            }
        });
    }

    createElement(info): HTMLElement {
        switch (info.component) {
            case "field":
                return this._createField(info);
            case "tab":
                return this._createTab(info);
            case "fieldset":
                return this._createFieldSet(info);
            case "section":
                return this._createSection(info);
            case "button":
                return this._createButton(info);
            case "nav":
                return this._createNav(info);
            case "separator":
                return this._createSeparator(info);
        }
        return null;
    }
    _createField(info): HTMLElement {
        const id = info.id || info.name;
        const field = $.create("gt-field");
        if (info.rlabel) {
            field.attr("rlabel", "rlabel");
        }

        const label = field.create("label");
        label.text(info.label);
        label.attr("for", id);
        const input = field.create(info.input);
        input.attr("data-form-element", "field");
        input.attr("id", id);
        if (info.type) {
            input.attr("type", info.type);
        }

        if (info.required) {
            field.create("required-ind").text("*");
        }
        return field.get();
    }

    _createTab(info): HTMLElement {
        const tab = $.create("wh-tab");
        info.elements.forEach((child) => {
            tab.create("wh-tab-menu").html(child.label);
            const panel = tab.create("wh-tab-panel");
            if (child.elements) {
                this.setElements(panel.get(), child.elements);
            }
        });
        return tab.get();
    }

    _createFieldSet(info): HTMLElement {
        const fieldset = $.create("fieldset");
        if (info.label) {
            fieldset.create("legend").html(info.label);
        }
        if (info.elements) {
            this.setElements(fieldset.get(), info.elements);
        }

        return fieldset.get();
    }

    _createSection(info): HTMLElement {
        const section = $.create("wh-section");

        section.create("section-caption").html(info.label);
        const body = section.create("section-body");
        if (info.elements) {
            this.setElements(body.get(), info.elements);
        }

        return section.get();
    }

    _createButton(info): HTMLElement {
        const button = $.create("button");
        button.html(info.label);
        return button.get();
    }

    _createNav(info): HTMLElement {
        const nav = $.create("form-container");

        if (info.elements) {
            this.setElements(nav.get(), info.elements);
        }

        return nav.get();
    }

    _createContainer(info): HTMLElement {
        const container = $.create("form-container");

        if (info.elements) {
            this.setElements(container.get(), info.elements);
        }

        return container.get();
    }

    _createSeparator(info): HTMLElement {
        const separator = $.create(info.tag || "hr");

        if (info.html) {
            separator.html(info.html);
        }

        if (info.className) {
            separator.addClass(info.className);
        }

        return separator.get();
    }
}

customElements.define("gt-form", GTForm);
