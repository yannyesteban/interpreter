import { Q as $ } from "./../Q.js";

function dispatchEvent(element, eventName, detail) {
	const event = new CustomEvent(eventName, {
		detail,
		cancelable: true,
		bubbles: true
	});

	element.dispatchEvent(event);
}

class WHRadioOption extends HTMLElement {

	static get observedAttributes() {
		return ["checked", "value"];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<style>
		*,
*::before,
*::after {
	box-sizing: border-box;
}
		:host{
			display:flex;
			align-items:center;
		}
		
		*{
			border:2px solid red;
		}
		input{
			margin-right:0.5em;
		}
		</style>
		
			<input type="radio" id="radio"><slot></slot>
		
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		switch (name) {
			case "checked":


				this._checked(this.hasAttribute("checked"));

				return;
		}

	}
	public connectedCallback() {
		this.slot = "option";

		if (!this.hasAttribute("role")) {
			this.setAttribute("role", "radio");
		}

		if (!this.hasAttribute("tabindex")) {
			this.setAttribute("tabindex", "-1");
		}

		//const radio = this.shadowRoot.querySelector(`input`);
		this.addEventListener("click", this._click.bind(this));

	}

	set checked(value) {
		console.log(this.value, value)
		if (Boolean(value)) {

			this.setAttribute("checked", "");
		} else {

			this.removeAttribute("checked");
		}

	}

	get checked() {
		return this.hasAttribute("checked");
	}


	set value(value) {

		if (Boolean(value)) {

			this.setAttribute("value", value);
		} else {

			this.removeAttribute("value");
		}

	}

	get value() {
		return this.getAttribute("value");
	}



	_checked(value) {
		console.log(value)
		const radio = this.shadowRoot.querySelector(`input[type="radio"]`) as HTMLInputElement;
		radio.checked = value;

	}

	_click(event) {

		//console.log(this.checked)
		this.checked = true;//event.currentTarget.checked;
		//event.stopPropagation();

	}
}


customElements.define("wh-radio-option", WHRadioOption);



class WHRadio extends HTMLElement {

	_last = null;

	static get observedAttributes() {
		return ["value", "filter"];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHRadio.css">
		<slot name="option"></slot>

		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			console.log("slotchange")
			//const nodes = slot.assignedNodes();
		});

	}


	public connectedCallback() {
		console.log("connectedCallback")
		this.shadowRoot.addEventListener("click", this._click.bind(this));

		this._last = this._getChecked();
		console.log(this._last)
		this.render();
	}

	get checked() {
		return this.hasAttribute("checked");
	}


	set value(value) {

		if (Boolean(value)) {
			this.setAttribute("value", value);
		} else {
			this.removeAttribute("value");
		}
	}

	get value() {
		const radio = this._getChecked() as WHRadioOption;
		if (radio) {
			return radio.value;
		}
		return null;
	}

	public set filter(value) {
		if (Boolean(value)) {

			this.setAttribute("filter", value);
		} else {

			this.removeAttribute("filter");
		}

	}

	public get filter() {

		return this.getAttribute("filter");
	}


	_click(event) {
		console.log("CLICK......", event.target, event.currentTarget)
		//return;
		if (event.target.getAttribute("role") === "radio") {

			if (this._last !== event.target) {

				if (this._last) {
					this._last.checked = false;
				}

				this.dispatchEvent(new Event("change"))
			}
			console.log("....", "click", event.target.checked)
			this._setChecked(event.target);


		}
	}
	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

		switch (name) {
			case "value":
				console.log(newVal)
				this._value(newVal);
				break;
			case "filter":
				this.render();
				break;
		}

	}

	set data(options) {
		options.forEach(info => {
			const option = $(this).create("wh-radio-option");
			option.value(info[0] || "");
			option.html(info[1] || "");
			if (info[2]) {
				$(option).ds("group", info[2])
			}
		})
	}

	set dataSource(source) {
		this.innerHTML = "";
		$(this).attr("id", source.id || null);
		$(this).attr("name", source.name || null);
		$(this).addClass(source.addClass || null);

		if (source.data) {
			this.data = source.data;
		}

		$(this).attr("value", source.value || "");

		if (source.events) {
			for (let key in source.events) {
				this.addEventListener(key, $.bind(source.events[key], this, "event"))
			}
		}

		this.render();

	}
	_allOptions(): WHRadioOption[] {
		return Array.from(this.querySelectorAll(`wh-radio-option`));
	}
	_linkRadios() {

	}

	reset() {
		const radios = this._allOptions();
		radios.forEach(radio => {
			radio.checked = false;
		})
	}


	_groupOptions() {

		return Array.from(this.querySelectorAll(`wh-radio-option[data-group="${this.filter}"]`));
	}
	_setChecked(option) {
		//this._uncheckAll();

		this._checkOption(option);

		option.focus();
	}
	_checkOption(option) {
		option.checked = "true";
		option.tabIndex = 0;
		this._last = option;
	}
	_uncheckAll() {

		const radios = Array.from(this.querySelectorAll(`wh-radio-option[checked]`)) as WHRadioOption[];

		radios.forEach(radio => {

			radio.checked = false;
			radio.tabIndex = -1;
		});


	}

	_value(value) {
		this._uncheckAll();

		const radios = this._allOptions();
		const radio = radios.find(radio => radio.getAttribute("value") === value);

		if (radio) {

			radio.checked = true;
			radio.tabIndex = -1;
			this._last = radio;
		};
	}

	_getChecked() {

		return this.querySelector(`wh-radio-option[checked]`);

	}

	resetData() {

		const options = this._allOptions();
		options.forEach(option => {
			option["slot"] = "";
		});

	}

	render() {

		this.resetData();
		let options = [];
		if (this.hasAttribute("filter")) {
			options = this._groupOptions();

		} else {
			options = this._allOptions();

		}

		options.forEach(option => {
			option.setAttribute("slot", "option");
		})
	}

}

customElements.define("wh-radio", WHRadio);