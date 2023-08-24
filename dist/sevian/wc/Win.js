//import { _sgQuery as $ } from "./Query.js";
import { Q as $ } from "./../Q.js";
import { getParentElement, fire } from "./../Tool.js";
import { Float, Move, Resize } from "./../Float.js";
import { MediaQuery } from "./../MediaQuery.js";
let last = null;
const screen = getComputedStyle(document.body).getPropertyValue("--device_mode").replace(/\W/g, "");
console.log("screen", screen);
function setActive(win) {
    if (last) {
        $(last).attr("active", false);
    }
    last = win;
    $(last).attr("active", true);
}
$(this).on("mousedown", (event) => {
    const win = event.target.closest("WH-WIN");
    if (win) {
        setActive(win);
    }
});
class WHWinIcon extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "icon";
    }
}
customElements.define("wh-win-icon", WHWinIcon);
class WHWinCaption extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-win-caption", WHWinCaption);
export class WHWinBody extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("wh-win-body", WHWinBody);
export class WHWinHeader extends HTMLElement {
    static get observedAttributes() {
        return ["mode", "paz"];
    }
    constructor() {
        super();
        this.win = null;
        this.mode = "";
        const template = document.createElement("template");
        template.innerHTML = `
			
			<link rel="stylesheet" href="./css/WHHeader.css">
			
				<div class="icon"><slot name="icon"></slot></div>
				<div class="caption"><slot name="caption"></slot></div>
				<div class="option"><slot name="option"></slot></div>
				<div class="control">
				
					<button class="min ss-symbols"></button>
					<button class="auto ss-symbols"></button>
					<button class="max ss-symbols"></button>
					<button class="exit ss-symbols"></button>
				</div>
			
			
			
			<slot></slot>

		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*this.shadowRoot.addEventListener("slotchange", (event) => {
            [...event.target.assignedElements()].forEach(e => {

            })

        });*/
    }
    connectedCallback() {
        this.slot = "header";
        $(this.shadowRoot)
            .query(".min")
            .on("click", (event) => {
            this.getWin().setAttribute("mode", "min");
        });
        $(this.shadowRoot)
            .query(".max")
            .on("click", (event) => {
            this.getWin().setAttribute("mode", "max");
        });
        $(this.shadowRoot)
            .query(".auto")
            .on("click", (event) => {
            this.getWin().setAttribute("mode", "");
            //this.getWin().updatePos();
            this.getWin().updateSize();
        });
        $(this.shadowRoot)
            .query(".exit")
            .on("click", (event) => {
            this.getWin().setAttribute("visibility", "hidden");
        });
        $(this).on("dblclick", (event) => {
            if (this.getWin().mode === "max") {
                this.getWin().setAttribute("mode", "");
            }
            else {
                this.getWin().setAttribute("mode", "max");
            }
        });
        this.getWin().addEventListener("mode-changed", (e) => {
            this.setAttribute("mode", e.detail.mode);
        });
    }
    attributeChangedCallback(name, oldVal, newVal) {
        //console.log("attributeChangedCallback");
    }
    getWin() {
        return getParentElement(this, "wh-win");
    }
}
customElements.define("wh-win-header", WHWinHeader);
export class WHWin extends HTMLElement {
    static get observedAttributes() {
        return [
            "caption",
            "hidden",
            "visibility",
            "mode",
            "resizable",
            "movible",
            "left",
            "top",
            "right",
            "bottom",
            "width",
            "height",
            "no-exit",
            "no-min",
            "no-max",
            "no-responsive",
        ];
    }
    constructor() {
        super();
        this.lastStatus = {
            mode: null,
            visibility: null,
            resizable: null,
        };
        window.addEventListener("media-query-changed", (e) => {
            if (e.detail.lowScreen) {
                if (this.mode !== "modal") {
                    this.lastStatus.mode = this.mode;
                    this.lastStatus.visibility = this.visibility;
                    this.lastStatus.resizable = this.resizable;
                }
                this.mode = "modal";
                this.visibility = "hidden";
                this.resizable = false;
            }
            else {
                this.mode = this.lastStatus.mode;
                this.visibility = this.lastStatus.visibility;
                this.resizable = this.lastStatus.resizable;
            }
        });
        /*
        $(this).on("mousedown", (e) => {
            console.log("mousedown");
            setActive(this);
        });
        */
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host{
				display: inline-block;
			}
			
			main{
				overflow: auto !important;
			}
			</style>
			<link rel="stylesheet" href="./css/WHWindow.css">
			
			<slot name="header"></slot>
			<slot name="body"></slot>
			<main><slot></slot><main>
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.addEventListener("slotchange", (event) => {
            if (this.left == null) {
                this.left = "center";
            }
            if (this.top == null) {
                this.top = "middle";
            }
            this.style.width = this.width;
            const target = event.target;
            //console.log(target.assignedElements());
            Float.show({ e: this, left: this.left, top: this.top });
        });
    }
    connectedCallback() {
        if (!this.getAttribute("mode")) {
            this.setAttribute("mode", "auto");
        }
        if (!this.getAttribute("no-responsive") && MediaQuery.isLowResolution()) {
            console.log("isLowResolution");
            this.mode = "modal";
            this.visibility = "hidden";
            this.resizable = false;
        }
        //const holder = this.querySelector(`wh-win-header`) as HTMLElement;
        const holder = document.createElement(`wh-win-header`);
        //$(holder).create("wh-win-caption").text(this.caption);
        //holder.innerText = this.caption
        this.append(holder);
        Float.init(this);
        Move.init({
            main: this,
            hand: holder,
            onDrag: (info) => {
                if (this.mode === "max") {
                    const w = this.offsetWidth;
                    this.setAttribute("mode", "custom");
                    const w2 = this.offsetWidth;
                    this.style.left = info.x - (w2 * (info.x - info.left)) / w + "px";
                    return true;
                }
            },
        });
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "mode":
                fire(this, "mode-changed", { mode: newVal });
                this._setMode();
                break;
            case "left":
            case "right":
            case "bottom":
            case "top":
                //this.updatePos();
                Float.show({ e: this, left: this.left, top: this.top });
                break;
            case "width":
            case "height":
                this.updateSize();
                break;
            case "resizable":
                this._resizable();
            case "visibility":
                break;
            case "caption":
                this.setCaption();
        }
        Float.upIndex(this);
    }
    set caption(value) {
        this.setAttribute("caption", value);
    }
    get caption() {
        return this.getAttribute("caption");
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
    set right(value) {
        if (Boolean(value)) {
            this.setAttribute("right", value);
        }
        else {
            this.removeAttribute("right");
        }
    }
    get right() {
        return this.getAttribute("right");
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
    set bottom(value) {
        if (Boolean(value)) {
            this.setAttribute("bottom", value);
        }
        else {
            this.removeAttribute("bottom");
        }
    }
    get bottom() {
        return this.getAttribute("bottom");
    }
    set visibility(value) {
        if (Boolean(value)) {
            this.setAttribute("visibility", value);
        }
        else {
            this.removeAttribute("visibility");
        }
    }
    get visibility() {
        return this.getAttribute("visibility");
    }
    set resizable(value) {
        if (Boolean(value)) {
            this.setAttribute("resizable", "");
        }
        else {
            this.removeAttribute("resizable");
        }
    }
    get resizable() {
        return this.hasAttribute("resizable");
    }
    test() { }
    updatePos() {
        if (this.hasAttribute("left")) {
            this.style.left = this.left;
        }
        if (this.hasAttribute("right")) {
            this.style.right = this.right;
        }
        if (this.hasAttribute("top")) {
            this.style.top = this.top;
        }
        if (this.hasAttribute("bottom")) {
            this.style.bottom = this.bottom;
        }
    }
    updateSize() {
        this.style.width = this.width;
        this.style.height = this.height;
        Float.show({ e: this, left: this.left, top: this.top });
    }
    _setMode() {
        if (this.mode === "modal") {
            const header = this.querySelector(`wh-win-header`);
            if (header) {
                header.mode = "modal";
            }
        }
    }
    _resizable() {
        if (this.resizable) {
            this._resize = Resize.init({
                main: this,
                onStart: (info) => {
                    this.style.left = info.left + "px";
                    this.style.width = info.width + "px";
                    this.style.top = info.top + "px";
                    this.style.height = info.height + "px";
                    this.setAttribute("mode", "custom");
                },
                onRelease: (info) => {
                    //this.width = info.width + "px";
                    //this.height = info.height + "px";
                },
            });
        }
        else {
            this._resize.stop();
            delete this._resize;
        }
    }
    show() {
        setTimeout((e) => {
            Float.show({ e: this, left: this.left, top: this.top });
        }, 800);
    }
    setCaption() {
        const holder = $(this).query("wh-win-header");
        //const holder: HTMLElement = document.createElement(`wh-win-header`);
        $(holder).create("wh-win-caption").text(this.caption);
        //holder.innerText = this.caption
    }
}
customElements.define("wh-win", WHWin);
//# sourceMappingURL=Win.js.map