

class Form1 extends HTMLFormElement {

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

		/*this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});*/

	}

	static get observedAttributes() {

		return ["color", "latitude", "longitude"];
	}

	public connectedCallback() {
        console.log("connectedCallback");
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback", name, oldVal, newVal);
		this[name] = newVal;
	}

}

customElements.define("wh-form", Form1, {extends: "form"});