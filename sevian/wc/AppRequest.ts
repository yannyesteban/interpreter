
export class AppRequest extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:none;
                border:3px solid orange;

			}
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() {
       
        this.addEventListener("click", () => {
            
            let data;
            if(this.type=="json"){
                
                data = JSON.parse(this.innerText);
                console.log(data)
            }
            //console.log(this.attributes)
            
            if(data){
                const app: any = document.querySelector("sevian-app");
                app.send(data);
            }else{
                console.log("no data was sent!")
            }
             
            
        });
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }
    
    set data(value) {
        this.innerText = JSON.stringify(value);
        
    }

    get data() {
        return JSON.parse(this.innerText);
    }

    

    send(){
        const app: any = document.querySelector("._main_app_");

             
        app.send(this.data);
    }

    

    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        } else {
            this.removeAttribute("type");
        }
    }

    get type() {
        return this.getAttribute("type");
    }


}

customElements.define("app-request", AppRequest);
