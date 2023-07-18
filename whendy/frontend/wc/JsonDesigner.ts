

const Menu1 = {
    name: "persons",
    caption: "Personas 2023",
    className: "whendy",

    groups: [
        {
            name: "person",
            items: [
                {
                    name: "id",
                    caption: "ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "name",
                    caption: "Nombre:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "lastname",
                    caption: "Apellido",
                    input: "input",
                    type: "text",
                },
            ],
        },
        {
            name: "jobs",
            items: [
                {
                    name: "jobId",
                    caption: "JOB ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "Job",
                    caption: "JOB:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "location",
                    caption: "Location",
                    input: "input",
                    type: "text",
                },
                {
                    name: "depart",
                    caption: "Depart",
                    input: "input",
                    type: "text",
                },
            ],
        },
    ],

    fields: [
        {
            name: "id",
            caption: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            caption: "Nombre:",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            caption: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};
class JsonDesigner extends HTMLElement {

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
<style>
		*{
			box-sizing: border-box;
		}
  :host {
    display:block;
    width:100%;
	height:100%;
	box-sizing: border-box;
	display:flex;
    
  }

  :host:not(:defined) {
    display:none;
    
  }

  .area{
	flex: 1 1 auto;
	
  }


</style><slot></slot><textarea class="area"></textarea>

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
		this.shadowRoot.querySelector(".area").textContent = JSON.stringify(Menu1, null,2);

	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}

}

customElements.define("json-designer", JsonDesigner);