class LastActive extends HTMLElement {
    static get observedAttributes() {
        return ["parent"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:none;

			}
			</style><slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        this.closest(this.designer).addEventListener("click", (event) => {
            const active = event.target.closest(this.container);
            if (active) {
                const p = this.closest(this.designer);
                p.setActive(active);
            }
        });
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "parent":
        }
    }
    set container(value) {
        if (Boolean(value)) {
            this.setAttribute("container", value);
        }
        else {
            this.removeAttribute("container");
        }
    }
    get container() {
        return this.getAttribute("container");
    }
    set designer(value) {
        if (Boolean(value)) {
            this.setAttribute("designer", value);
        }
        else {
            this.removeAttribute("designer");
        }
    }
    get designer() {
        return this.getAttribute("designer");
    }
}
customElements.define("last-active-ext", LastActive);
//# sourceMappingURL=LastActiveExt.js.map