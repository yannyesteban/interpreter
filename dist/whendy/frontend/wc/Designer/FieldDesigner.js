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
                this.selected = true;
            }
            else {
                this.selected = false;
            }
        });
    }
    connectedCallback() {
        this.setAttribute("role", "field-designer");
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
}
customElements.define("field-designer", FieldDesigner);
//# sourceMappingURL=FieldDesigner.js.map