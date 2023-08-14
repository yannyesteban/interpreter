import { Q as $ } from "./../../Q.js";
class TableMenu extends HTMLElement {
    static get observedAttributes() {
        return ["table", "caption", "fields"];
    }
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
			.holder{
				display:inline-block;
				width:1rem;
				height:1rem;
			}
			</style><slot></slot>
			
			
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
        this.iName = this.shadowRoot.querySelector(`.name`);
        this.iCaption = this.shadowRoot.querySelector(`.caption`);
        this.iInput = this.shadowRoot.querySelector(`.input`);
        this.iType = this.shadowRoot.querySelector(`.type`);
        //this.slot = "table-menu";
    }
    connectedCallback() {
        this.slot = "table-menu";
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "caption":
                this.iCaption.value = newValue;
                break;
            case "input":
                this.iInput.value = newValue;
                break;
            case "type":
                this.iType.value = newValue;
                break;
            case "name":
                this.iName.value = newValue;
                break;
        }
    }
    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        }
        else {
            this.removeAttribute("caption");
        }
    }
    get caption() {
        return this.getAttribute("caption");
    }
    set dataSource(data) {
        for (const info of data.groups) {
            this.createGroup(info);
        }
    }
    createGroup(info) {
        const menu = $(this).create("menu");
        const li = menu.create("li");
        const link = li.create("a");
        link.text(info.name);
        link.attr("draggable", "true");
        link.on("dragstart", (event) => {
            event.dataTransfer.dropEffect = "copy";
            event.dataTransfer.setData("text", JSON.stringify(info.items));
            console.log(event);
        });
        const ul = li.create("ul");
        for (const item of info.items) {
            const li = ul.create("li");
            li.text(item.name);
            li.attr("draggable", "true");
            li.on("dragstart", (event) => {
                console.log([item]);
                event.dataTransfer.dropEffect = "copy";
                event.dataTransfer.setData("text", JSON.stringify([item]));
            });
        }
    }
}
customElements.define("table-menu", TableMenu);
//# sourceMappingURL=TableMenu.js.map