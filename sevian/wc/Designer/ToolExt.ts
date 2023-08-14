class ToolExt extends HTMLElement {
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
                position:absolute;
                right:2px;
                top:2px;
                
                

			}
            :host(:hover){
                color:red;
            }
			</style><button class="config">s</button><button>x</button><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() {

        this.parentElement.style.position = "relative";
        this.shadowRoot.querySelector(".config").addEventListener("click", (event)=>{
            this.parentElement["showConfig"]();
        })

        
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("tool-ext", ToolExt);
