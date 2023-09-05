import { Q as $ } from "../Q.js";
import { fire } from "../Tool.js";
import { Float } from "../Float.js";
const html = 0;
class PopupCaption extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("ss-popup-caption", PopupCaption);
class PopupBody extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("ss-popup-body", PopupBody);
class PopupButton extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("ss-popup-button", PopupButton);
class Popup extends HTMLElement {
    static get observedAttributes() {
        return ["caption", "text", "mode", "left", "top", "width", "height", "auto-close", "closable"];
    }
    constructor() {
        super();
        this._timer = null;
        const template = document.createElement("template");
        template.innerHTML = /*html*/ `

			<style>

				:host{
					display: inline-block;
				}
			
			</style>
			<!--<link rel="stylesheet" href="./css/WHPopup.css">-->
            <style>
            @import "./css/WHPopup.css";
            </style>
			<slot name="caption"></slot>
			<slot name="body"></slot>
			<slot name="button"></slot>
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.addEventListener("slotchangeee", (event) => {
            //Float.show({ e: this, left: this.left, top: this.top });
        });
    }
    handleEvent(event) {
        if (event.type === "click") {
            console.log("CLICK...............", this, event.target);
            if (this.contains(event.target)) {
                if (event.target.dataset.type == "close") {
                    this.mode = "close";
                }
                else if (this.autoClose) {
                    this.mode = "close";
                }
                return;
            }
            if (this.closable) {
                this.mode = "close";
            }
        }
        else if (event.type === "mouseover") {
            this._stopTimer();
        }
        else if (event.type === "mouseout") {
            this._setTimer();
        }
    }
    connectedCallback() {
        this.handleEvent = this.handleEvent.bind(this);
        Float.init(this);
        if (!this.mode) {
            this.mode = "open";
        }
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
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
                console.log(this.top);
                Float.show({ e: this, left: this.left, top: this.top });
                break;
            case "width":
            case "height":
                this.updateSize();
                break;
            case "caption":
                this.setCaption();
                break;
            case "text":
                this.setBody();
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
    set text(value) {
        if (Boolean(value)) {
            this.setAttribute("text", value);
        }
        else {
            this.removeAttribute("text");
        }
    }
    get text() {
        return this.getAttribute("text");
    }
    set mode(value) {
        if (Boolean(value)) {
            this.setAttribute("mode", value);
        }
        else {
            this.removeAttribute("mode");
        }
    }
    get mode() {
        return this.getAttribute("mode");
    }
    set left(value) {
        if (Boolean(value)) {
            this.setAttribute("left", value);
        }
        else {
            this.removeAttribute("left");
        }
    }
    get left() {
        return this.getAttribute("left");
    }
    set top(value) {
        if (Boolean(value)) {
            this.setAttribute("top", value);
        }
        else {
            this.removeAttribute("top");
        }
    }
    get top() {
        return this.getAttribute("top");
    }
    set width(value) {
        if (Boolean(value)) {
            this.setAttribute("width", value);
        }
        else {
            this.removeAttribute("width");
        }
    }
    get width() {
        return this.getAttribute("width");
    }
    set height(value) {
        if (Boolean(value)) {
            this.setAttribute("height", value);
        }
        else {
            this.removeAttribute("height");
        }
    }
    get height() {
        return this.getAttribute("height");
    }
    set delay(value) {
        if (Boolean(value)) {
            this.setAttribute("delay", value);
        }
        else {
            this.removeAttribute("delay");
        }
    }
    get delay() {
        return this.getAttribute("delay");
    }
    set closable(value) {
        if (Boolean(value)) {
            this.setAttribute("closable", "");
        }
        else {
            this.removeAttribute("closable");
        }
    }
    get closable() {
        return this.hasAttribute("closable");
    }
    set autoClose(value) {
        if (Boolean(value)) {
            this.setAttribute("auto-close", "");
        }
        else {
            this.removeAttribute("auto-close");
        }
    }
    get autoClose() {
        return this.hasAttribute("auto-close");
    }
    updateSize() {
        this.style.width = this.width;
        this.style.height = this.height;
        Float.show({ e: this, left: this.left, top: this.top });
    }
    _close() {
        document.removeEventListener("click", this.handleEvent);
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
        document.addEventListener("click", this.handleEvent);
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
    setCaption() {
        console.log(this.caption);
        $(this).findOrCreate("ss-popup-caption", "ss-popup-caption").addClass("popup-caption").html(this.caption);
    }
    setBody() {
        $(this).findOrCreate("ss-popup-body", "ss-popup-body").addClass("popup-body").html(this.text);
    }
    set dataSource(source) {
        for (const [prop, value] of Object.entries(source)) {
            this[prop] = value;
        }
    }
}
customElements.define("ss-popup", Popup);
//# sourceMappingURL=Popup.js.map