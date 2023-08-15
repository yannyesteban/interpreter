import { Q as $ } from "../Q.js";
import "./Field.js";
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
    connectedCallback() { }
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
				
				
             }

            
            </style>
		<slot name="icon"></slot>
        <slot></slot>	
        <slot name="ind"></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => { });
    }
    connectedCallback() {
        this.slot = "caption";
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
}
customElements.define("gt-caption", GTCaption);
class GTForm extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
        this._data = {};
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
    connectedCallback() {
        this.initList();
        this._setStore();
    }
    _setStore() {
        customElements.whenDefined("data-store").then(() => {
            const store = this.querySelector("data-store");
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
    getFields() {
        return Array.from(this.querySelectorAll(`[data-form-element="field"]`));
    }
    getValues() {
        return Array.from(this.querySelectorAll(`[name]`))
            .filter((e) => e["name"])
            .reduce((a, element) => {
            a[element.name] = element.value;
            return a;
        }, {});
    }
    _setDataList(parentName, value) {
        console.log(parentName, value);
        const lists = $(this).queryAll(`[data-parent="${parentName}"]`);
        console.log(lists);
        lists.forEach((list) => {
            if (list.get().tagName === "SELECT") {
                this._updateSelect(list.get(), value);
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
        }
        else {
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
    set dataField(info) {
        const field = this.querySelector(`[name="${info.field}"]`);
        field.innerHTML = "";
        let value = field.value;
        let _value = null;
        if (info.data.length > 0) {
            _value = info.data[0].value;
        }
        info.data.forEach((option) => {
            if (option.value == info.value) {
                _value = option.value;
            }
            const opt = document.createElement("option");
            opt.value = String(option.value); // the index
            opt.innerHTML = String(option.text);
            field.appendChild(opt);
        });
        field.value = _value;
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
        sel.forEach((select) => {
            let parentValue = "";
            const parentName = select.getAttribute("data-parent");
            if (parentName) {
                const parentField = this.getField(parentName);
                console.log(parentField, parentField.value);
                if (parentField) {
                    parentValue = parentField.value;
                }
            }
            this._setDataList(parentName, parentValue);
        });
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
    set dataSource(source) {
        this.innerHTML = "";
        console.log(source);
        if (source.dataLists) {
            this._createDataLists(source.dataLists);
        }
        if (source.caption) {
            this._createCaption(source.caption);
        }
        if (source.className) {
            $(this).addClass(source.className);
        }
        //this._data = source.data || {};
        //console.log(this._data);
        this.setElements(this, source.elements);
        const dataLists = Array.from(this.querySelectorAll(`datalist[data-name]`));
        for (const list of dataLists) {
            const name = list.dataset.name;
            const element = this.querySelector(`[data-form-element="field"][name="${name}"]`);
            this._setDataOptions(list, element);
        }
        this.values = source.data || {};
    }
    set values(data) {
        this.getFields().forEach((field) => {
            if (data[field.name]) {
                field.value = data[field.name];
            }
        });
    }
    _setDataOptions(dataList, element) {
        const options = Array.from(dataList.querySelectorAll("option"));
        element.innerHTML = "";
        options.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = String(option.value); // the index
            opt.innerHTML = String(option.text);
            element.appendChild(opt);
        });
    }
    _createDataLists(dataLists) {
        for (const [name, info] of Object.entries(dataLists)) {
            const dataList = $(this).create("datalist");
            dataList.ds("name", name);
            dataList.ds("filter", info.level || "");
            info.data.forEach((item) => {
                //alert(item.value)
                const option = dataList.create("option");
                option.prop("value", item.value);
                option.ds("level", info.level || "");
                option.html(item.text);
            });
        }
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
            }
            else {
                throw new Error("component not found!");
            }
        });
    }
    createElement(info) {
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
    _createField(info) {
        const id = info.id || undefined;
        const name = info.name || "";
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
        input.attr("name", name);
        if (info.type) {
            input.attr("type", info.type);
        }
        if (name in this._data) {
            input.value(this._data[name]);
        }
        if (info.required) {
            field.create("required-ind").text("*");
        }
        return field.get();
    }
    _createTab(info) {
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
    _createFieldSet(info) {
        const fieldset = $.create("fieldset");
        if (info.label) {
            fieldset.create("legend").html(info.label);
        }
        if (info.elements) {
            this.setElements(fieldset.get(), info.elements);
        }
        return fieldset.get();
    }
    _createSection(info) {
        const section = $.create("wh-section");
        section.create("section-caption").html(info.label);
        const body = section.create("section-body");
        if (info.elements) {
            this.setElements(body.get(), info.elements);
        }
        return section.get();
    }
    _createButton(info) {
        const button = $.create("button");
        for (const [key, value] of Object.entries(info.events || {})) {
            button.on(key, $.bind(value, this));
        }
        button.attr(info.attr || {});
        button.html(info.label);
        return button.get();
    }
    _createNav(info) {
        const nav = $.create("form-container");
        if (info.elements) {
            this.setElements(nav.get(), info.elements);
        }
        return nav.get();
    }
    _createContainer(info) {
        const container = $.create("form-container");
        if (info.elements) {
            this.setElements(container.get(), info.elements);
        }
        return container.get();
    }
    _createSeparator(info) {
        const separator = $.create(info.tag || "hr");
        if (info.html) {
            separator.html(info.html);
        }
        if (info.className) {
            separator.addClass(info.className);
        }
        return separator.get();
    }
    test(h, i) {
        console.log(h, i);
    }
}
customElements.define("gt-form", GTForm);
//# sourceMappingURL=GTForm.js.map