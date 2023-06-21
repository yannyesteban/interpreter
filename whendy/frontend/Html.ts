class Html extends HTMLElement {

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

	public connectedCallback() {

	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}

}

customElements.define("wh-html", Html);