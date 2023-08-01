import { Q as $ } from "../Q.js";

interface RequestAction {
    id: string;
    panelId: string;
    type: string;
    element: string;
    name: string;
    source: string;
    method: string;
    eparams: object;
    resToken: string;
}
interface Request {
    mode: string; //elements,simple
    valid: boolean;
    confirm: string;
    form: string;
    body: object;
    actions: RequestAction[];
}

interface ComponentResponse {
    element: string;
    name: string;
    mode: string;
    prop: string;
}

interface HtmlResponse {
    element: string;
    id: string;
    mode: string;
    html: string;
    prop: string;
    attr: string;
}

interface TaskResponse {
    mode: string;
    element: string;
    name: string;
    panel: string;
    props: [];
}

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
    store;
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
        this.initList();
        this._setStore();
    }

    _setStore() {
        customElements.whenDefined("data-store").then(() => {
            const store = <any>this.querySelector("data-store");

            if (store) {
                this.addEventListener("change", (event) => {
                    if (event.target["name"]) {
                        store.add(event.target["name"], event.target["value"]);
                        console.log(event.target["value"]);
                    }
                });
            }
        });
    }
    getField(name) {
        return this.querySelector(`[name="${name}"]`);
    }

    _setDataList(parentName, value) {
        console.log(parentName, value);
        const lists = $(this).queryAll(`[data-parent="${parentName}"]`);
        console.log(lists);
        lists.forEach((list) => {
            if (list.get<HTMLElement>().tagName === "SELECT") {
                this._updateSelect(list.get<HTMLElement>(), value);
            }
        });
    }

    _updateSelect(select, filter) {
        console.log(select, filter);
        const listName = select.getAttribute("list");
        const list = this.querySelector(`datalist[id="${listName}"]`);
        console.log(list);
        let options; //list.querySelectorAll("option");

        if (filter == "") {
            options = list.querySelectorAll("option");
        } else {
            options = list.querySelectorAll(`option[data-level="${filter}"]`);
        }
        select.innerHTML = "";
        let value = select.value;
        let _value = null;
        if (options.length > 0) {
            _value = options[0].value;
        }
        options.forEach((option) => {
            if (option.value == value) {
                _value = option.value;
            }
            const opt = document.createElement("option");
            opt.value = String(option.value); // the index
            opt.innerHTML = String(option.text);

            select.appendChild(opt);
        });
        console.log(_value);
        select.value = _value;
        if (value != _value) {
            $(select).fire("change", []);
        }
    }
    initList() {
        const fields = $(this).queryAll("[data-childs=true]");
        fields.forEach((field) => {
            field.on("change", (event) => {
                console.log("xxxx");
                this._setDataList(event.target.name, event.target.value);
            });
        });

        const sel = this.querySelectorAll("select[list]");
        sel.forEach((select: HTMLSelectElement) => {
            let parentValue = "";
            const parentName = select.getAttribute("data-parent");
            if (parentName) {
                const parentField = <HTMLSelectElement>this.getField(parentName);
                console.log(parentField, parentField.value);
                if (parentField) {
                    parentValue = parentField.value;
                }
            }

            this._setDataList(parentName, parentValue);
        });
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

        if (source.caption) {
            this._createCaption(source.caption);
        }

        if (source.className) {
            $(this).addClass(source.className);
        }

        this.setElements(this, source.elements);
    }

    _createCaption(value) {
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
