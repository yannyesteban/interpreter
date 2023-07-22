class Container extends HTMLElement {
    static get observedAttributes() {
        return ["selected", "active"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<style>
			:host {
				display:block;
				border:4px solid green;
				min-height:20px;
				padding:6px;
			}
		</style>
		
		<slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            console.log("assignedNodes", slot.assignedNodes());
            slot.assignedNodes().forEach((node) => {
                console.log("**************", node);
                if (node.draggable) {
                    return;
                }
                node.draggable = true;
            });
        });
        this.addEventListener("focus", (event) => {
            this.selected = true;
        });
        this.addEventListener("blur", (event) => {
            this.selected = false;
        });
        this.addEventListener("dragover", (event) => {
            this.style.border = "2px solid orange";
            event.preventDefault();
        });
        this.addEventListener("dragleave", (event) => {
            this.style.border = "";
            event.preventDefault();
        });
        this.addEventListener("drop", (event) => {
            console.log(event, event.target.tagName);
            event.preventDefault();
            event.stopImmediatePropagation();
            const items = this.getItems(event.dataTransfer);
            if (!items) {
                return;
            }
            let beforeOf = null;
            if (event.target != this) {
                const rect = event.target.getBoundingClientRect();
                const diff = event.clientY - rect.top;
                if (diff > rect.height / 2) {
                    beforeOf = event.target.nextSibling;
                }
                else {
                    beforeOf = event.target;
                }
            }
            console.log(items);
            this.style.border = "4px solid purple";
            if (beforeOf) {
                items.forEach((item) => event.target.parentNode.insertBefore(item, beforeOf));
            }
            else {
                items.forEach((item) => this.appendChild(item));
            }
            this.setItems(null);
        });
        this.addEventListener("dragstart", (event) => {
            event.stopPropagation();
            console.log("START....", event.target);
            event.dataTransfer.dropEffect = "copy";
            this.setItems([event.target]);
        });
    }
    connectedCallback() {
        console.log(this);
        //this.slot = "container";
        this.setAttribute("role", "container");
        const ele = document.createElement("last-active-ext");
        ele.setAttribute("container", "[role=container]");
        ele.setAttribute("designer", "[role=designer]");
        this.appendChild(ele);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) { }
    set selected(value) {
        value = Boolean(value);
        if (value) {
            this.setAttribute("selected", "");
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.hasAttribute("selected");
    }
    getItems(data) {
        const parent = this.closest("[role=designer]");
        if ("getItems" in parent) {
            console.log(parent.getItems());
            return parent.getItems();
        }
        return null;
    }
    setItems(items) {
        const parent = this.closest("[role=designer]");
        if ("setItems" in parent) {
            return parent.setItems(items);
        }
        return null;
    }
}
customElements.define("item-container", Container);
//# sourceMappingURL=Container.js.map