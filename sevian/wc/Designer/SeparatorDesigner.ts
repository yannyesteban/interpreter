class SeparatorDesigner extends HTMLElement {
    private _data: any = {};
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:block;
                height:10px;
                background-colorr:white;

			}
			</style><div><slot><hr></slot></div>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() {
        this.setAttribute("designer-type", "button");
        this.setAttribute("role", "button");
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }

    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        } else {
            this.removeAttribute("caption");
        }
    }

    get caption() {
        return this.getAttribute("caption");
    }

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    

    

    set tag(value) {
        if (Boolean(value)) {
            this.setAttribute("tag", value);
        } else {
            this.removeAttribute("tag");
        }
    }

    get tag() {
        return this.getAttribute("tag");
    }


    get designerType() {
        return this.hasAttribute("designer-type");
    }

    set dataSource(data){
        
        this._data = data;
        this.tag = data.tag;
    }



    get dataSource(){

        this._data.component = "separator";
        this._data.tag = this.tag;
        this._data.html = this.innerHTML;
        
        
      

        
        return this._data;
    }
}

customElements.define("separator-designer", SeparatorDesigner);
