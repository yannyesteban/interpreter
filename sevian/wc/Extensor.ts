class Extensor extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:inline-block;

			}
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() {}

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("extensor-func", Extensor);
