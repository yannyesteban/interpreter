import { Q as $ } from "../Q.js";

import { getParentElement, fire } from "../Tool.js";

import { Float, Move, Drag, Resize } from "../Float.js";

const html =0;


class WHPopup extends HTMLElement {
	_timer = null;

	a=5
	static get observedAttributes() {
		return ["mode", "left", "top", "width", "height", "caption",
			"delay", "auto-close",
		];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = /*html*/ `

			<link rel="stylesheet" href="./css/WHPopup.css">
			
			<slot></slot>
			`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		/*
		this.shadowRoot.addEventListener("slotchange", (event) => {
					[...event.target.assignedElements()].forEach(e => {
						console.log(e.nodeName)
						if (e.nodeName.toLowerCase() == "wh-win-header") {
							e.slot = "header"
						}

						if (e.nodeName.toLowerCase() == "wh-win-body") {
							e.slot = "body"
						}
					})

				});
		*/

	}

	handleEvent(event) {
		if (event.type === "click") {
			if (event.target === this) {
				return;
			}
			this.mode = "close";

		}else if(event.type === "mouseover"){

		}else if(event.type === "mouseout"){

		}
	}


	public connectedCallback() {

		

		//this._click = this._click.bind(this);
		this._mouseover = this._mouseover.bind(this);
		this._mouseout = this._mouseout.bind(this);

		Float.init(this);
		/*
		Float.show({
			e: this,
			left: this.left || "acenter",
			top: this.top || "bottom",
			deltaY: "80"
		});
		*/
		if (this.mode !== "open" && this.mode !== "close") {
			this.mode = "open";
		}


	}

	_click(event) {

		if (event.target === this) {
			return;
		}
		this.mode = "close";
	}

	_mouseover(event) {
		this._stopTimer();
	}

	_mouseout(event) {
		this._setTimer();
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


		//$(document).on("click", this._click);
		//$(this).on("mouseover", this._mouseover);
		//$(this).on("mouseout", this._mouseout);

		this.tabIndex = 0;
		this._setTimer();

	}

	_setTimer() {
		if (this.delay) {
			this._timer = setTimeout(() => { this.mode = "close"; }, Number(this.delay));
		}
	}

	_stopTimer() {
		if (this._timer) {
			clearTimeout(this._timer);
		}
	}




	public disconnectedCallback() {
		console.log("disconnectedCallback");


	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback", name);

		switch (name) {
			case "mode":
				console.log(newVal)
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

				break;
			case "width":
			case "height":

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


}

customElements.define("ss-popup", WHPopup);