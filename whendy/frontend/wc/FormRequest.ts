import { Q as $ } from "../Q.js";

class FormRequest extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
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

    public connectedCallback() {

        Promise.all([
            customElements.whenDefined("data-store"),
            customElements.whenDefined("gt-form"),
            
        ]).then(() => this.load());
       
    }

    load(){

        if(!this.watch){
            return;
        }
        const store = document.querySelector("#store1");
        console.log(this.watch)

        const form:any = this.closest(this.form) || this.parentElement 

        const fn = $.bind(this.innerHTML, form, "data", "value")

        store.addEventListener(`${this.watch}-change`, (event:CustomEvent)=>{
            this._send(fn, form.getValues());
            
            
          
        }),
        this._send(fn, form.getValues());

    }
    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {}

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

    set watch(value) {
        if (Boolean(value)) {
            this.setAttribute("watch", value);
        } else {
            this.removeAttribute("watch");
        }
    }

    get watch() {
        return this.getAttribute("watch");
    }


    set form(value) {
        if (Boolean(value)) {
            this.setAttribute("form", value);
        } else {
            this.removeAttribute("form");
        }
    }

    get form() {
        return this.getAttribute("form");
    }

    _send(fn, body){
        console.log(body)
        const headers = {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${this.token}`,
            //SID: this.sid,
            "Application-Id": this.id,
            "Application-Mode": "get",
        };

        fetch("../whendy/json/forms/person.json", {
            method: "get",
            headers: { ...headers },
            body
            
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
            
            })
            .then((json) => {
                fn(json, 85)
            });
    }
}

customElements.define("form-request", FormRequest);
