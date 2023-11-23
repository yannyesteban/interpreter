import { Q as $ } from "../Q.js";
import { valid } from "../Valid.js";
import "./Field.js";
//const CSS = "./css/WHForm.css";
const CSS = "../html/css/WHForm.css";
class FormContainer extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		
        <style>
            @import "${CSS}";
        </style>
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
        this.modeInit = false;
        this._resquest = {};
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;

			}
			</style>
            <slot name="caption"></slot>
            <slot name="app-request"></slot>
            <slot></slot>
            
            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot:not([name])");
        slot.addEventListener("slotchange", (event) => {
            const lists = Array.from(slot.querySelectorAll("datalist:not(.__ready__)"));
            for (const list of lists) {
                const name = list.dataset.name;
                const inputs = Array.from(this.querySelectorAll(`[name="${name}"]`));
                for (const input of inputs) {
                    //input.classList.add("__ready__");
                    //console.log(list, input);
                    this._setDataOptions(list, input);
                    //input.value = list.getAttribute("data-value"); //this._values[e.name].toString()
                }
                list.classList.add("__ready__");
            }
            const elems = Array.from(this.querySelectorAll(`[data-form-element="field"]:not(.__ready__)`));
            for (const input of elems) {
                const list = this.querySelector(`datalist[data-name="${input.name}"]`);
                if (list) {
                    //input.classList.add("__ready__");
                    //console.log(list, input);
                    this._setDataOptions(list, input);
                    //input.value = list.getAttribute("data-value"); //this._values[e.name].toString()
                }
            }
            this.modeInit = false;
        });
    }
    handleEvent(event) {
        if (event.type === "change") {
            console.log(event.detail, event.target.name);
            const lists = $(this).queryAll(`datalist[data-parent="${event.target.name}"]`);
            if (lists) {
                for (const list of lists) {
                    const name = list.ds("name");
                    const mode = list.ds("mode");
                    if (mode) {
                        const request = this.getAppRequest("dataField");
                        if (request) {
                            request.sendTo = request.sendTo || this;
                            request.masterData = {
                                parent: event.target.name,
                            };
                            $(this).fire("app-request", request);
                        }
                    }
                    else {
                        const element = $(`[name="${name}"]`);
                        if (element) {
                            this._setDataOptions(list.get(), element.get(), event.target.value);
                        }
                    }
                }
            }
        }
    }
    connectedCallback() {
        /*
        $(".save1").on("click", () => {
            this.appendChild($.create("div").get<HTMLElement>());

            const s = $.create("select").get<HTMLSelectElement>();
            s.dataset.formElement = "field";
            s.name = "city_id";
            this.appendChild(s);

            const d2 = document.getElementById("d2");
            this.append(d2);
        });
        */
        this._setStore();
        $(this).on("change", this);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
        $(this).off("change", this);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
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
    set caption(value) {
        const _caption = $(this).findOrCreate("gt-caption", "gt-caption");
        _caption.html(value);
    }
    get caption() {
        const _caption = $(this).query("gt-caption");
        if (_caption) {
            return _caption.html();
        }
        return;
    }
    set elements(elems) {
        this.setElements(this, elems);
        if (this._data) {
            this.values = this._data;
        }
    }
    get elements() {
        return;
    }
    set dataLists(lists) {
        if (lists) {
            lists.forEach((info) => {
                this._createDataList(info);
            });
        }
    }
    set appRequests(request) {
        customElements.whenDefined("app-request").then((x) => {
            Array.from($(this).queryAll("app-request")).forEach((e) => e.remove());
            if (request) {
                for (const [name, info] of Object.entries(request)) {
                    const r = $(this).create("app-request").get();
                    r.setAttribute("name", name);
                    r.setAttribute("type", "json");
                    r.setAttribute("slot", "app-request");
                    r["data"] = info;
                    console.log(info);
                }
            }
        });
    }
    set dataSource(info) {
        this.innerHTML = "";
        this.modeInit = true;
        this._data = null;
        for (const [key, value] of Object.entries(info)) {
            this[key] = value;
        }
    }
    set values(data) {
        if (typeof data !== "object") {
            console.warn("data dont found!");
        }
        this.getFields().forEach((field) => {
            if (data[field.name]) {
                field.value = data[field.name];
            }
        });
        this._data = data;
    }
    set dataFields(dataFields) {
        //alert(8)
        for (const info of dataFields) {
            const list = this._createDataList(info);
            const element = this.querySelector(`[data-form-element="field"][name="${info.name}"]`);
            if (element) {
                this._setDataOptions(list, element);
            }
        }
    }
    _setDataOptions(list, input, level) {
        console.log(input);
        if (list.dataset.parent) {
            level = this.querySelector(`[data-form-element="field"][name="${list.dataset.parent}"]`).value;
        }
        let options;
        if (level) {
            options = Array.from(list.querySelectorAll(`option[data-level="${level}"],option[data-level="*"]`));
        }
        else {
            options = Array.from(list.querySelectorAll("option"));
        }
        input.classList.add("__ready__");
        input.innerHTML = "";
        options.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = String(option.value);
            opt.innerHTML = String(option.text);
            input.appendChild(opt);
        });
        input.value = list.getAttribute("data-value");
        if (!this.modeInit) {
            $(input).fire("change", { value: input.value });
        }
    }
    _createDataList(info) {
        let dataList = $(this).query(`datalist[data-name="${info.name}"]`);
        if (dataList) {
            dataList.remove();
        }
        dataList = $.create("datalist");
        dataList.ds("name", info.name);
        dataList.ds("mode", info.mode || "");
        dataList.ds("parent", info.parent || "");
        dataList.ds("childs", info.childs || "");
        dataList.ds("filter", info.level || "");
        dataList.ds("value", info.value || "");
        info.data.forEach((item) => {
            //alert(item.value)
            const option = dataList.create("option");
            option.prop("value", item.value);
            option.ds("level", item.level || "");
            option.html(item.text);
        });
        $(this).append(dataList);
        return dataList.get();
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
                console.log(element);
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
        if (this._data && name in this._data) {
            input.value(this._data[name]);
        }
        const ind = field.create("required-ind");
        if (info.required) {
            input.attr("required", "");
            ind.text("*");
        }
        if (info.rules) {
            if (info.rules.required) {
                ind.text("*");
            }
            input.ds("rules", JSON.stringify(info.rules));
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
        button.attr("type", "button");
        button.attr(info.attr || {});
        button.html(info.label);
        return button.get();
    }
    _createNav(info) {
        info.context = this;
        info.actionContext = this.tagName.toLowerCase();
        const nav = $.create("ss-nav").prop("dataSource", info);
        /*
        console.log(info)
        const nav = $.create("form-container");

        if (info.elements) {
            this.setElements(nav.get(), info.elements);
        }
        */
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
    getAppRequest(name) {
        var _a;
        return (_a = this.querySelector(`app-request[name="${name}"]`)) === null || _a === void 0 ? void 0 : _a.data;
    }
    test(h, i) {
        console.log(h, i);
    }
    valid() {
        for (const f of Array.from($(this).queryAll(`[data-form-element="field"][data-rules]`))) {
            const input = f.get();
            const rules = JSON.parse(f.ds("rules") || "{}");
            console.log(rules);
            const result = valid(rules, f.value(), "title: string");
            if (result.error) {
                input.setCustomValidity(result.message);
                input.reportValidity();
                return result;
            }
            input.setCustomValidity("");
        }
        return { error: false };
    }
}
customElements.define("gt-form", GTForm);
//# sourceMappingURL=GTForm.js.map