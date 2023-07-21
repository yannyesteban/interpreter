class CaptionDesigner extends HTMLElement {
    static get observedAttributes() {
        return ["parent", "property"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style><div>CAPTION</div>`;

            this.addEventListener("input", (event)=>{
                this.closest("[role=designer]").setAttribute("caption", this.innerText) 
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
        this.innerHTML = this.closest("[role=designer]").getAttribute("caption"); 
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        
    }
}

customElements.define("caption-ext", CaptionDesigner);
