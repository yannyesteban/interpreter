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
                
                
                
                height:1.6rem;
                line-height:1.6rem;

			}
            :host(:focus){
                background-color:gray;
            }
			</style>[ <slot></slot> ]`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        if (navigator.userAgent.includes("Firefox")) {
            this.addEventListener("focus", (event) => {
                document.querySelectorAll("[draggable]").forEach((d) => {
                    d.draggable = false;
                    //d.dataset["draggable"] = "true"
                });
                //this.draggable = false;
            });
            this.addEventListener("blur", (event) => {
                document.querySelectorAll("[draggable]").forEach((d) => {
                    d.draggable = true;
                });
                //this.draggable = true;
            });
        }
    }
    connectedCallback() {
        this.setAttribute("contenteditable", "true");
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    set target(value) {
        if (Boolean(value)) {
            this.setAttribute("target", value);
        }
        else {
            this.removeAttribute("target");
        }
    }
    get target() {
        return this.getAttribute("target");
    }
}
customElements.define("caption-ext", CaptionDesigner);
//# sourceMappingURL=CaptionDesigner.js.map