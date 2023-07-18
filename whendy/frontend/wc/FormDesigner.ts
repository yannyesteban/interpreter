import { Q as $ } from "./../Q.js";

const tableMenu = {
	"person":["id", "name", "lastname", "age", "birth"]
}

const form1 = {
    name: "persons",
    title: "Personas 2023",
    className: "whendy",

    query: "SELECT * FROM person",
    table: "person",

    fields: [
        {
            name: "id",
            title: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            title: "Nombre",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            title: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};

class TableMenu extends HTMLElement {
    iName: HTMLInputElement;
    iCaption: HTMLInputElement;
    iInput: HTMLSelectElement;
    iType: HTMLSelectElement;

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
			<ul>
				<li draggable="true">xxxx<a href="#">Inicio</a></li>
				<li draggable="true">xxxx<a href="#">Tutoriales</a></li>
				<li draggable="true">xxxx<a href="#">Cursos</a></li>
				<li draggable="true">xxxx<a href="#">Bootcamps</a></li>
				<li draggable="true">xxxx<a href="#">Contacto</a></li>
			</ul>
			
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

    

    public connectedCallback() {
		this.slot = "table-menu";
	}

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldValue, newValue) {
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
        } else {
            this.removeAttribute("caption");
        }
    }

    get caption() {
        return this.getAttribute("caption");
    }
}

customElements.define("table-menu", TableMenu);

class FieldDesigner extends HTMLElement {
    iName: HTMLInputElement;
    iCaption: HTMLInputElement;
    iInput: HTMLSelectElement;
    iType: HTMLSelectElement;

    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:block;
				
				
			}

			:host:not(:defined) {
				display:none;
				
			}
			.holder{
				display:inline-block;
				width:1rem;
				height:1rem;
			}
            input{
                
            }
            
            input[type=text]{
                
                max-width:80px;
            }
			</style><slot></slot>
			<div class="field">
				<div class="holder">...</div><input class="select" type="checkbox"/><input class="name" placeholder="name" type="text"
				/><input class="caption" placeholder="caption" type="text"
				/><input class="default" placeholder="...Default" type="text"
				/><select class="input" placeholder="input" 
				/><option value="input">input</option></select><select class="type" placeholder="type"><option value="text">text</option><
				/select><input class="required" type="checkbox">*
			</div>
			
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
    }

    static get observedAttributes() {
        return ["name", "caption", "input", "type"];
    }

    public connectedCallback() {}

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldValue, newValue) {
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
        } else {
            this.removeAttribute("caption");
        }
    }

    get caption() {
        return this.getAttribute("caption");
    }
}

customElements.define("field-designer", FieldDesigner);

class FormDesigner extends HTMLElement {
    iTitle;
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
			.table-menu{
				border:1px solid red;
			}
			</style>
			<div class="header">Designer: <span class="title"></span></div>
            <div><button class="add">+</button><button class="del">-</button><button class="section">G</button><button class="tab">T</button></div>
			<div class="fields"><slot></slot></div>
			<div class="table-menu"><slot name="table-menu"></slot></div>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });

        this.iTitle = this.shadowRoot.querySelector(".title");

    }

    static get observedAttributes() {
        return ["title"];
    }

    public connectedCallback() {
        this.load();
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "title":
				
                this.iTitle.innerHTML = newValue;
                break;
        }
    }

    set title(value) {
        if (Boolean(value)) {
            this.setAttribute("title", value);
        } else {
            this.removeAttribute("title");
        }
    }

    get title() {
        return this.getAttribute("title");
    }

    load() {
        this.title = form1.title;
        const fields = form1.fields;

        for (const info of fields) {
            const field = $(this).create("field-designer");
            field.attr("name", info.name);
            field.attr("caption", info.title);
            field.attr("input", info.input);
            field.attr("type", info.type);
        }

		$(this.shadowRoot.querySelector(".fields")).on("dragover",(event)=>{
			event.preventDefault();
		})
		$(this.shadowRoot.querySelector(".fields")).on("drop",(event)=>{
			event.preventDefault();
			//var data = event.dataTransfer.getData("text");
			const field = $(this).create("field-designer");
            /*field.attr("name", info.name);
            field.attr("caption", info.title);
            field.attr("input", info.input);
            field.attr("type", info.type);*/
			event.target.appendChild(field.get());
		})


		

		const tableMenu = $(this).create("table-menu");
    }
}

customElements.define("form-designer", FormDesigner);
