class CaptionDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["parent", "property", "target"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:inline-block;
                min-width:10px;
                border:solid red 2px;

			}
			</style><div>CAPTION</div>`;

            this.addEventListener("input", (event)=>{
                this.closest(this.target).setAttribute("caption", this.innerText) 
             })
            return
        this.attachShadow({ mode: "open" });

        
        //this.shadowRoot.appendChild(template.content.cloneNode(true));

        const ele = this.shadowRoot.querySelector("div");
        ele.addEventListener("click", event=>{
            ele.setAttribute("contenteditable", "true");
            
            console.log("xxx", this.parentElement, this.closest("[role=designer]"))

            
        });

        ele.addEventListener("input", (event)=>{
           this.closest("[role=designer]").setAttribute("caption", ele.innerText) 
        })

        
    }

    public connectedCallback() {
        this.setAttribute("contenteditable", "true")
        
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log(name, oldVal, newVal, this.closest(this.target))
        
        this.innerHTML = "---"+this.closest(this.target).getAttribute("caption"); 
    }

    set target(value) {
        if (Boolean(value)) {
            this.setAttribute("target", value);
        } else {
            this.removeAttribute("target");
        }
    }

    get target() {
        return this.getAttribute("target");
    }
}

customElements.define("caption-ext", CaptionDesigner);
