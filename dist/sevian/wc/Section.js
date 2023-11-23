//const CSS_PATH = "./css/WHForm.css";
const CSS_PATH = "../html/css/WHForm.css";
class SectionCaption extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<style>
			@import "${CSS_PATH}";
		</style>
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("section-caption", SectionCaption);
class SectionBody extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<style>
		@import "${CSS_PATH}";
	</style>
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("section-body", SectionBody);
class Section extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<style>
		@import "${CSS_PATH}";
	</style>
		<slot name="caption"></slot>	
		<slot name="body"></slot>
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() { }
}
customElements.define("wh-section", Section);
//# sourceMappingURL=Section.js.map