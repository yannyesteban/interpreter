class WaitLayer extends HTMLElement {
    _parent: HTMLElement = null;
    _pointerEvents: any;
    _position: any;
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
                position:absolute;
                left:0px;
                top:0px;
				display:flex;
                background-color:rgba(114, 114, 114, 0.65);
                
                height:100%;
                width:100%;
                overflow:hidden;

			}
            
            
            /* creating css loader */
            
            .loading {
                aspect-ratio: auto 1 / 1; 
                _width: 0.5rem;
                height: min(2rem, 50%);
                border: 3px solid #f3f3f3;
                border-top: 3px solid black;
                border-radius: 100%;
                margin: auto;
                animation: spin 1s infinite linear;
            }
            :host(.display) {
                visibility: visible;
            }
            @keyframes spin {
                from {
                   
                    transform: rotate(0deg);
                }
                to {
                   
                    transform: rotate(360deg);
                }
            }
			</style><div class="loading"></div>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback() {
        this._parent = this.parentElement;

        if (!this._parent.hasAttribute("data-pointer-events")) {
            this._parent.setAttribute("data-pointer-events", this._parent.style.pointerEvents);
        }

        if (!this._parent.style.position) {
            this._position = this._parent.style.position;
            this._parent.style.position = "relative";
        }

        this._parent.style.pointerEvents = "none";
    }

    public disconnectedCallback() {
        if (!this._parent.style.position) {
            this._position = this._parent.style.position;
            this._parent.style.position = "relative";
        }

        if (this._parent.hasAttribute("data-pointer-events")) {
            this._parent.style.pointerEvents = this._parent.getAttribute("data-pointer-events");
        }
    }

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

    test() {
        console.log("existo");
    }
}

customElements.define("wait-layer", WaitLayer);
