class FieldDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["name", "caption", "input", "type", "default", "selected"];
    }
    constructor() {
        super();
        this._data = {};
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;
				padding:10px;
				
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
                    <option value="select">select</option>
                    <option value="textarea">textarea</option>
                </select>
                <select class="type" placeholder="type">
                    <option value="text">text</option>
                    <option value="password">password</option>
                    <option value="radio">radio</option>
                    <option value="checkbox">checkbox</option>
                    <option value="time">time</option>
                    <option value="hidden">hidden</option>
                    <option value="color">color</option>
                    <option value="date">date</option>
                    <option value="email">email</option>
                    <option value="range">range</option>
                    <option value="time">time</option>
                    <option value="datetime-local">datetime-local</option>
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
                this.selected = true;
            }
            else {
                this.selected = false;
            }
        });
    }
    connectedCallback() {
        this.setAttribute("designer-type", "field");
        this.setAttribute("role", "field-designer");
        if (!this.name) {
            const designer = this.closest("[role=designer]");
            this.name = "field_" + Array.from(designer.querySelectorAll("[role=field-designer]")).length;
        }
        if (!this.caption) {
            const designer = this.closest("[role=designer]");
            this.caption = this.name;
        }
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
            this.setAttribute("selected", "");
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.hasAttribute("selected");
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
    get designerType() {
        return this.hasAttribute("designer-type");
    }
    set dataSource(data) {
        this._data = data;
    }
    get dataSource() {
        this._data.component = "field";
        this._data.name = this.iName.value;
        this._data.label = this.iCaption.value;
        this._data.input = this.iInput.value;
        this._data.type = this.iType.value;
        this._data.default = this.default;
        return this._data;
    }
}
customElements.define("field-designer", FieldDesigner);
//# sourceMappingURL=FieldDesigner.js.map