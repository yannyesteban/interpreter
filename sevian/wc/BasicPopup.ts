import { Q as $ } from "../Q.js";

import { getParentElement, fire } from "../Tool.js";

import { Float, Move, Drag, Resize } from "../Float.js";

const html = 0;

class BasicPopup extends HTMLElement {
    _timer = null;

    static get observedAttributes() {
        return ["mode", "left", "top", "width", "height", "closable"];
    }

    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = /*html*/ `

			<style>

				:host{
					display: inline-block;
				}
			
			</style>
			<link rel="stylesheet" href="./css/WHPopup.css">
			
			<slot></slot>
			`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.addEventListener("slotchangeee", (event) => {
            //Float.show({ e: this, left: this.left, top: this.top });
        });
    }

    handleEvent(event) {
        if (event.type === "click") {
            if (event.target === this) {
                return;
            }
			if(this.closable){
				this.mode = "close";
			}
            
        } else if (event.type === "mouseover") {
            this._stopTimer();
        } else if (event.type === "mouseout") {
            this._setTimer();
        }
    }

    public connectedCallback() {
        Float.init(this);

        if (!this.mode) {
            this.mode = "open";
        }
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback", name, oldVal, newVal);

        switch (name) {
            case "mode":
                if (newVal === "close") {
                    this._close();
                }
                if (newVal === "open") {
                    this._open();
                }
                fire(this, "mode-changed", { mode: newVal });
                break;
            case "left":
            case "top":
                Float.show({ e: this, left: this.left, top: this.top });
                break;
            case "width":
            case "height":
                this.updateSize();
                break;
        }
    }

    set mode(value) {
        if (Boolean(value)) {
            this.setAttribute("mode", value);
        } else {
            this.removeAttribute("mode");
        }
    }

    get mode() {
        return this.getAttribute("mode");
    }

    set left(value) {
        if (Boolean(value)) {
            this.setAttribute("left", value);
        } else {
            this.removeAttribute("left");
        }
    }

    get left() {
        return this.getAttribute("left");
    }

    set top(value) {
        if (Boolean(value)) {
            this.setAttribute("top", value);
        } else {
            this.removeAttribute("top");
        }
    }

    get top() {
        return this.getAttribute("top");
    }

    set width(value) {
        if (Boolean(value)) {
            this.setAttribute("width", value);
        } else {
            this.removeAttribute("width");
        }
    }

    get width() {
        return this.getAttribute("width");
    }

    set height(value) {
        if (Boolean(value)) {
            this.setAttribute("height", value);
        } else {
            this.removeAttribute("height");
        }
    }

    get height() {
        return this.getAttribute("height");
    }
    set delay(value) {
        if (Boolean(value)) {
            this.setAttribute("delay", value);
        } else {
            this.removeAttribute("delay");
        }
    }

    get delay() {
        return this.getAttribute("delay");
    }


	set closable(value) {
        if (Boolean(value)) {
            this.setAttribute("closable", value);
        } else {
            this.removeAttribute("closable");
        }
    }

    get closable() {
        return this.getAttribute("closable");
    }

    public updateSize() {
        this.style.width = this.width;
        this.style.height = this.height;

        Float.show({ e: this, left: this.left, top: this.top });
    }

    _close() {
        document.removeEventListener("click", this.handleEvent.bind(this));
        this.removeEventListener("mouseover", this.handleEvent);
        this.removeEventListener("mouseout", this.handleEvent);

        this.style.zIndex = "-1";

        if (this._timer) {
            clearTimeout(this._timer);
        }
        this.tabIndex = -1;
    }

    _open() {
        Float.upIndex(this);

        document.addEventListener("click", this.handleEvent.bind(this));
        this.addEventListener("mouseover", this.handleEvent);
        this.addEventListener("mouseout", this.handleEvent);

        this.tabIndex = 0;
        this._setTimer();
    }

    _setTimer() {
        if (this.delay) {
            this._timer = setTimeout(() => {
                this.mode = "close";
            }, Number(this.delay));
        }
    }

    _stopTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }
}


customElements.define("basic-popup", BasicPopup);