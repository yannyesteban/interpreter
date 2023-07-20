import { Q as $ } from "./../Q.js";
class FieldInfo {
    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
    }
}
const tableMenu = {
    person: ["id", "name", "lastname", "age", "birth"],
};
const form1 = {
    name: "persons",
    caption: "Personas 2023",
    className: "whendy",
    query: "SELECT * FROM person",
    table: "person",
    fields: [
        {
            name: "id",
            caption: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            caption: "Nombre:",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            caption: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};
const Menu1 = {
    name: "persons",
    caption: "Personas 2023",
    className: "whendy",
    groups: [
        {
            name: "person",
            items: [
                {
                    name: "id",
                    caption: "ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "name",
                    caption: "Nombre:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "lastname",
                    caption: "Apellido",
                    input: "input",
                    type: "text",
                },
            ],
        },
        {
            name: "jobs",
            items: [
                {
                    name: "jobId",
                    caption: "JOB ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "Job",
                    caption: "JOB:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "location",
                    caption: "Location",
                    input: "input",
                    type: "text",
                },
                {
                    name: "depart",
                    caption: "Depart",
                    input: "input",
                    type: "text",
                },
            ],
        },
    ],
    fields: [
        {
            name: "id",
            caption: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            caption: "Nombre:",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            caption: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};
class PageDesigner extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
<style>
  :host {
    display:inline-block;
    
    
  }

  :host:not(:defined) {
    display:none;
    
  }
</style><slot></slot>

`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
}
customElements.define("page-designer", PageDesigner);
class TabDesigner extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            :host {
                display:inline-block;
             }

            :host:not(:defined) {
                display:none;
                
            }
            </style>
            TabDesigner
            <button class="plus">+</button>
            <slot></slot>

            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.shadowRoot.querySelector(".plus").addEventListener("click", (event) => {
            $.fire(this, "add-tab", {});
        });
    }
    connectedCallback() {
        this.slot = "container";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    addPage(info) {
        const page = $(this).create("div").addClass("tab-page");
        const head = page.create("div").addClass("head");
        const body = page.create("div");
        head.append(info.caption);
        body.append(info.body);
    }
    get length() {
        return Array.from(this.querySelectorAll(":scope > .tab-page")).length;
    }
}
customElements.define("tab-designer", TabDesigner);
class ItemData extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
<style>
  :host {
    display:inline-block;
    
    
  }

  :host:not(:defined) {
    display:none;
    
  }
</style><slot></slot>

`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    static get observedAttributes() {
        return ["f", "latitude", "longitude"];
    }
    connectedCallback() { }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
}
customElements.define("item-data", ItemData);
class FieldContainer extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
        this.defaultName = "field_";
        this._index = 0;
        this._last = null;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            :host {
                display:block;
                border:6px solid green;
                
            }

            :host:not(:defined) {
                display:none;
                
            }
            </style>
            <button class="add">+</button>
            <button class="delete">-</button>
            <slot name="field-designer"></slot>

            `;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.shadowRoot.querySelector(".add").addEventListener("click", (event) => {
            this.appendChild(this.createField({ input: "input", type: "text" }));
        });
        this.shadowRoot.querySelector(".delete").addEventListener("click", (event) => {
            this.delete(this.getSelected());
        });
    }
    connectedCallback() {
        this.setAttribute("role", "field-container");
        this.slot = "container";
        this.load();
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    getItems() {
        const form = $(this).parentElement("form-designer");
        if (form) {
            return form.getItems();
        }
    }
    setItems(items) {
        const form = $(this).parentElement("form-designer");
        if (form) {
            form.setItems(items);
        }
    }
    load() {
        const item = this.getItems();
        const fields = form1.fields;
        for (const info of fields) {
            this.appendChild(this.createField(info));
        }
        $(this).on("dragover", (event) => {
            event.preventDefault();
        });
        $(this /*.shadowRoot.querySelector(".fields")*/).on("drop", (event) => {
            const items = this.getItems();
            event.preventDefault();
            console.log(event.dataTransfer.getData("text/plain"), event.dataTransfer.types);
            //var data = event.dataTransfer.getData("text");
            /*field.attr("name", info.name);
            field.attr("caption", info.caption);
            field.attr("input", info.input);
            field.attr("type", info.type);*/
            console.log(event.dataTransfer);
            console.log(event, event.target.tagName);
            let beforeOf = null;
            if ( /*this.contains(event.target) &&*/event.target.tagName === "FIELD-DESIGNER") {
                console.log("ADENTRO.....");
                const rect = event.target.getBoundingClientRect();
                const diff = event.clientY - rect.top;
                if (diff > rect.height / 2) {
                    beforeOf = event.target.nextSibling;
                }
                else {
                    beforeOf = event.target;
                }
            }
            console.log(items);
            if (items) {
                console.log("correct--------");
                items.forEach((item) => {
                    this.addField(item, event.target.parentNode, beforeOf);
                });
            }
            else {
                if (event.dataTransfer.getData("text")) {
                    try {
                        const data = JSON.parse(event.dataTransfer.getData("text"));
                        data.forEach((info) => {
                            const field = this.createField(info);
                            this.addField(field, event.target.parentNode, beforeOf);
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            this.setItems(null);
        });
    }
    addField(field, parentNode, beforeOf) {
        if (beforeOf) {
            parentNode.insertBefore(field, beforeOf);
        }
        else {
            this.appendChild(field);
        }
    }
    createField(info) {
        const field = $.create("field-designer");
        if (!info.name) {
            this._index++;
            info.name = this.defaultName + this._index.toString();
        }
        if (!info.caption) {
            info.caption = info.name;
        }
        field.prop("info", info);
        field.on("dragstart", (event) => {
            //this._last = field.get() as FieldDesigner;
            const container = field.get().closest("field-container");
            if (field.prop("selected")) {
                container.style.border = "4px solid red";
                container.setItems(container.getSelected());
            }
            else {
                container.setItems([field.get()]);
            }
            console.log(container.getItems());
            //event.dataTransfer.setData("text/plain", null);
        });
        console.log("ok");
        return field.get();
    }
    get length() {
        return Array.from(this.querySelectorAll(":scope > [role=field-designer]")).length;
    }
    delete(items) {
        items.forEach(item => {
            item.remove();
        });
    }
    getSelected() {
        return Array.from(this.querySelectorAll(":scope > [role=field-designer][selected]"));
    }
}
customElements.define("field-container", FieldContainer);
class TableMenu extends HTMLElement {
    static get observedAttributes() {
        return ["table", "caption", "fields"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:inline-block;
				
				
			}

			:host:not(:defined) {
				display:none;
				
			}
			.holder{
				display:inline-block;
				width:1rem;
				height:1rem;
			}
			</style><slot></slot>
			
			
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.iName = this.shadowRoot.querySelector(`.name`);
        this.iCaption = this.shadowRoot.querySelector(`.caption`);
        this.iInput = this.shadowRoot.querySelector(`.input`);
        this.iType = this.shadowRoot.querySelector(`.type`);
        //this.slot = "table-menu";
    }
    connectedCallback() {
        this.slot = "table-menu";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "caption":
                this.iCaption.value = newValue;
                break;
            case "input":
                this.iInput.value = newValue;
                break;
            case "type":
                this.iType.value = newValue;
                break;
            case "name":
                this.iName.value = newValue;
                break;
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
    set dataSource(data) {
        for (const info of data.groups) {
            this.createGroup(info);
        }
    }
    createGroup(info) {
        const menu = $(this).create("menu");
        const li = menu.create("li");
        const link = li.create("a");
        link.text(info.name);
        link.attr("draggable", "true");
        link.on("dragstart", (event) => {
            event.dataTransfer.dropEffect = "copy";
            event.dataTransfer.setData("text", JSON.stringify(info.items));
            console.log(event);
        });
        const ul = li.create("ul");
        for (const item of info.items) {
            const li = ul.create("li");
            li.text(item.name);
            li.attr("draggable", "true");
            li.on("dragstart", (event) => {
                console.log([item]);
                event.dataTransfer.dropEffect = "copy";
                event.dataTransfer.setData("text", JSON.stringify([item]));
            });
        }
    }
}
customElements.define("table-menu", TableMenu);
class FieldDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["name", "caption", "input", "type", "default", "selected"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;
				
				
			}

			:host:not(:defined) {
				display:none;
				
			}
			.holder{
				display:inline-block;
				width:1rem;
				height:1rem;
			}
            input{
                
            }
            
            input[type=text]{
                
                max-width:80px;
            }
            .field{
                display:flex;
            }
			</style><slot></slot>
			<div class="field">
				<div class="holder">...</div>
                <input class="select" type="checkbox"/>
                <input class="name" placeholder="name" type="text"/>
                <input class="caption" placeholder="caption" type="text"/>
                <input class="default" placeholder="...Default" type="text"/>
                <select class="input" placeholder="input"/>
                    <option value="input">input</option>
                </select>
                <select class="type" placeholder="type">
                    <option value="text">text</option>
                </select>
                <input class="required" type="checkbox">*
                <button>C</button>
                <button>R</button>
                <button>H</button>
                <button>X</button>
			</div>
			
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.iName = this.shadowRoot.querySelector(`.name`);
        this.iCaption = this.shadowRoot.querySelector(`.caption`);
        this.iInput = this.shadowRoot.querySelector(`.input`);
        this.iType = this.shadowRoot.querySelector(`.type`);
        /*
        this.iCaption.addEventListener("dragstart",event=>{
            event.preventDefault()
            event.stopImmediatePropagation();
            console.log("---------------")
        });
        this.iCaption.addEventListener("drop",event=>{
            event.preventDefault()
            event.stopImmediatePropagation();
            console.log("***---------------")
            this.iCaption.value = event.dataTransfer.getData("text/plain")
            
        })
        */
        this.shadowRoot.querySelector(".select").addEventListener("change", (event) => {
            if (event.target.checked) {
                this.selected = "true";
            }
            else {
                this.selected = "";
            }
        });
    }
    connectedCallback() {
        this.setAttribute("role", "field-designer");
        this.slot = "field-designer";
        this.shadowRoot.querySelector(".holder").setAttribute("draggable", "true");
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        switch (name) {
            case "caption":
                this.iCaption.value = newValue;
                break;
            case "input":
                this.iInput.value = newValue;
                break;
            case "type":
                this.iType.value = newValue;
                break;
            case "name":
                this.iName.value = newValue;
                break;
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
    set selected(value) {
        if (Boolean(value)) {
            this.setAttribute("selected", value);
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.getAttribute("selected");
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
    set default(value) {
        if (Boolean(value)) {
            this.setAttribute("default", value);
        }
        else {
            this.removeAttribute("default");
        }
    }
    get default() {
        return this.getAttribute("default");
    }
    set info(info) {
        this._info = info;
        this.name = info.name;
        this.caption = info.caption;
        this.input = info.input;
        this.type = info.type;
        this.default = info.default;
    }
    get info() {
        return this._info;
    }
}
customElements.define("field-designer", FieldDesigner);
class FormDesigner extends HTMLElement {
    constructor() {
        super();
        this.defaultName = "field_";
        this._index = 0;
        this._last = null;
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;
                padding:10px;
                height:300px;
				
				
			}

			:host:not(:defined) {
				display:none;
				
			}
            nav{
                display:inline-flex;
            }
			.table-menu{
				border:1px solid red;
			}
            .fields{
                margin:20px;
            }

            button{
                display:inline-block;
                margin:0px;
            }

            [contenteditable=true]{
                background-color:black;
            }

            wh-tab-menu {
                max-width: 120px;
            }
			</style>
			<div class="header">Designer: <span class="caption"></span></div>
            <nav>
                <button class="add">+</button>
                <button class="del">-</button>
                <button class="section">G</button>
                <button class="tab">T</button>
            </nav>
			<div class="fields"><slott></slott></div>
            <div class="container"></div>
			<div class="table-menu">
            4<slot name="container">......</slot>
            <slot name="table-menu"></slot></div>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.iCaption = this.shadowRoot.querySelector(".caption");
        this.iSection = this.shadowRoot.querySelector(".section");
        this.iTab = this.shadowRoot.querySelector(".tab");
    }
    static get observedAttributes() {
        return ["caption"];
    }
    connectedCallback() {
        $(this.iTab).on("click", (event) => {
            const tab1 = $(this).create("tab-designer").get();
            tab1.addPage({ caption: "uno", body: $.create("field-container").get() });
            tab1.addEventListener("add-tab", (event) => {
                tab1.addPage({
                    caption: "Tab page " + (1 + tab1.length).toString(),
                    body: $.create("field-container").get(),
                });
            });
            return;
            const tab = $(this.shadowRoot.querySelector(".container")).create("wh-tab").get();
            tab.addEventListener("tab-open", (event) => {
                if (event.detail.index == tab.length - 1) {
                    const page = tab.querySelector(`wh-tab-menu[index="${event.detail.index}"]`);
                    page.innerHTML = "tab " + (+event.detail.index + 1);
                    $(page).on("dblclick", (event) => {
                        page.setAttribute("contenteditable", "true");
                    });
                    $(page).on("blur", (event) => {
                        page.setAttribute("contenteditable", "false");
                    });
                    tab.addPage({
                        menu: "+",
                        panel: "",
                    });
                }
            });
            tab.addPage({
                menu: "Page",
                panel: "<slot></slot>",
            });
            tab.addPage({
                menu: "+",
                panel: "",
            });
            Array.from(tab.querySelectorAll(`wh-tab-menu`)).forEach((e) => {
                $(e).on("dblclick", (event) => {
                    e.setAttribute("contenteditable", "true");
                });
                $(e).on("blur", (event) => {
                    e.setAttribute("contenteditable", "false");
                });
            });
        });
        this.load();
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "caption":
                this.iCaption.innerHTML = newValue;
                break;
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
    load() {
        this.caption = form1.caption;
        $(this).create("field-container");
        const tableMenu = $(this).create("table-menu").get();
        tableMenu.dataSource = Menu1;
        return;
        const fields = form1.fields;
        for (const info of fields) {
            this.appendChild(this.createField(info));
        }
        $(this.shadowRoot.querySelector(".fields")).on("dragover", (event) => {
            event.preventDefault();
        });
        $(this).on("dragover", (event) => {
            event.preventDefault();
        });
        $(this /*.shadowRoot.querySelector(".fields")*/).on("drop", (event) => {
            event.preventDefault();
            console.log(event.dataTransfer.getData("text/plain"), event.dataTransfer.types);
            //var data = event.dataTransfer.getData("text");
            /*field.attr("name", info.name);
            field.attr("caption", info.caption);
            field.attr("input", info.input);
            field.attr("type", info.type);*/
            console.log(event.dataTransfer);
            console.log(event, event.target.tagName);
            let beforeOf = null;
            if (this.contains(event.target) && event.target.tagName === "FIELD-DESIGNER") {
                console.log("ADENTRO.....");
                const rect = event.target.getBoundingClientRect();
                const diff = event.clientY - rect.top;
                if (diff > rect.height / 2) {
                    beforeOf = event.target.nextSibling;
                }
                else {
                    beforeOf = event.target;
                }
            }
            console.log(this._last);
            if (this._last && this.contains(this._last)) {
                console.log("correct--------");
                this.addField(this._last, event.target.parentNode, beforeOf);
            }
            else {
                if (event.dataTransfer.getData("text")) {
                    try {
                        const data = JSON.parse(event.dataTransfer.getData("text"));
                        data.forEach((info) => {
                            const field = this.createField(info);
                            this.addField(field, event.target.parentNode, beforeOf);
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            this._last = null;
        });
    }
    addField(field, parentNode, beforeOf) {
        if (beforeOf) {
            parentNode.insertBefore(field, beforeOf);
        }
        else {
            this.appendChild(field);
        }
    }
    createField(info) {
        const field = $.create("field-designer");
        if (!info.name) {
            this._index++;
            info.name = this.defaultName + this._index.toString();
        }
        if (!info.caption) {
            info.caption = info.name;
        }
        field.prop("info", info);
        field.on("dragstart", (event) => {
            this._last = field.get();
            console.log(event);
            //event.dataTransfer.setData("text/plain", null);
        });
        return field.get();
    }
    setItems(items) {
        this._items = items;
    }
    getItems() {
        return this._items;
    }
}
customElements.define("form-designer", FormDesigner);
//# sourceMappingURL=FormDesigner.js.map