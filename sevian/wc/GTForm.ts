import { Q as $ } from "../Q.js";
import "./Field.js";
import { Sevian } from "./Sevian.js";

import { AppRequest } from "./AppRequest.js";

interface RequestAction {
    id: string;
    panelId: string;
    type: string;
    element: string;
    name: string;
    source: string;
    method: string;
    params: object;
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
			
		<link rel="stylesheet" href="./css/WHForm.css">
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
    private _data: any = {};
    private _values: any;
    modeInit: boolean = false;
    _resquest: any = {};
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

        const slot: HTMLSlotElement = this.shadowRoot.querySelector("slot:not([name])");

        slot.addEventListener("slotchange", (event: any) => {
            const lists: HTMLElement[] = Array.from(slot.querySelectorAll("datalist:not(.__ready__)"));

            for (const list of lists) {
                const name = list.dataset.name;
                const inputs: HTMLInputElement[] = Array.from(this.querySelectorAll(`[name="${name}"]`));
                for (const input of inputs) {
                    //input.classList.add("__ready__");
                    //console.log(list, input);

                    this._setDataOptions(list, input);

                    //input.value = list.getAttribute("data-value"); //this._values[e.name].toString()
                }

                list.classList.add("__ready__");
            }

            const elems: HTMLInputElement[] = Array.from(
                this.querySelectorAll(`[data-form-element="field"]:not(.__ready__)`),
            );

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
                            let info = request.data;
                            info.form = this;
                            info.actions[0].params = {
                                parent: event.target.name,
                            };

                            const app: any = document.querySelector("._main_app_");

                            app.send(info);
                        }
                        /* 
                        const app: Sevian = this.closest("sevian-app");
                        app.send({
                            form: this,
                            actions: [
                                {
                                    type: "element",
                                    element: "form",
                                    id: this.id,
                                    name: "two",
                                    method: "data-fields",
                                    params: {
                                        parent: event.target.name,
                                    },
                                },
                            ],
                        });*/
                    } else {
                        const element = $(`[name="${name}"]`);
                        if (element) {
                            this._setDataOptions(list.get(), element.get(), event.target.value);
                        }
                    }
                }
            }
        }
    }

    public connectedCallback() {
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

    public disconnectedCallback() {
        console.log("disconnectedCallback");

        $(this).off("change", this);
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
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

    getFields(): HTMLInputElement[] {
        return Array.from(this.querySelectorAll(`[data-form-element="field"]`));
    }

    getValues() {
        return Array.from(this.querySelectorAll(`[name]`))
            .filter((e) => e["name"])
            .reduce((a, element: HTMLInputElement) => {
                a[element.name] = element.value;
                return a;
            }, {});
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
        
        /*
        const appRequest = {
            dataField: {
                //form: this,
                actions: [
                    {
                        type: "element",
                        element: "form",
                        id: this.id,
                        name: "two",
                        method: "data-fields",
                    },
                ],
            },
        };
        */

        customElements.whenDefined("app-request").then((x) => {

            if(source.appRequests){
                for(const [name, info] of Object.entries(source.appRequests)){
                    const r = $(this).create("app-request").get<HTMLElement>();
                    r.setAttribute("name", name);
                    r.setAttribute("type", "json");
                    r["data"] = info;
                    console.log(info);
                }

            }


            
        });

        this.modeInit = true;
        this.innerHTML = "";
        console.log(source);

        if (source.caption) {
            this._createCaption(source.caption);
        }

        if (source.className) {
            $(this).addClass(source.className);
        }

        //this._data = source.data || {};
        //console.log(this._data);

        this.setElements(this, source.elements);

        /*
        const dataLists: HTMLElement[] = Array.from(this.querySelectorAll(`datalist[data-name]`));

        for (const list of dataLists) {
            const name = list.dataset.name;
            const element = this.querySelector(`[data-form-element="field"][name="${name}"]`);
            this._setDataOptions(list, element);
        }
        */
        console.log("FINAL.....");
        this.values = source.data || {};

        if (source.dataLists) {
            source.dataLists.forEach((info) => {
                this._createDataList(info);
            });
        }
    }

    set values(data) {
        this.getFields().forEach((field) => {
            if (data[field.name]) {
                field.value = data[field.name];
            }
        });
    }

    set dataFields(dataFields) {
        //alert(8)
        for (const info of dataFields) {
            const list = this._createDataList(info);
            const element: HTMLInputElement = this.querySelector(`[data-form-element="field"][name="${info.name}"]`);
            if (element) {
                this._setDataOptions(list, element);
            }
        }
    }

    _setDataOptions(list, input: HTMLInputElement, level?) {
        console.log(input);
        if (list.dataset.parent) {
            level = this.querySelector<HTMLInputElement>(
                `[data-form-element="field"][name="${list.dataset.parent}"]`,
            ).value;
        }
        let options: HTMLOptionElement[];

        if (level) {
            options = Array.from(list.querySelectorAll(`option[data-level="${level}"],option[data-level="*"]`));
        } else {
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
            } else {
                console.log(element)
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
        for (const [key, value] of Object.entries(info.events || {})) {
            button.on(key, $.bind(value, this));
        }
        button.attr("type", "button")
        button.attr(info.attr || {});
        button.html(info.label);
        return button.get();
    }

    _createNav(info): HTMLElement {
        info.context = this;
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

    getAppRequest(name: string): AppRequest {
        return this.querySelector(`app-request[name="${name}"]`);
    }

    sendRequest(name) {
        const info = this.getAppRequest(name)?.data;
        if (info) {
            info.form = this;
            const app: any = document.querySelector("._main_app_");

            app.send(info);
        }else{
            console.log("request don't exists!");
        }
    }

    test(h, i) {
        console.log(h, i);
    }
}

customElements.define("gt-form", GTForm);
