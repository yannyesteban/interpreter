import { Q as $ } from "./../Q.js";
import { getParentElement } from "./../Tool.js";
import { App } from "./App.js";
import { Sevian } from "./Sevian.js";


function dispatchEvent(element, eventName, detail) {
	const event = new CustomEvent(eventName, {
		detail,
		cancelable: true,
		bubbles: true
	});

	element.dispatchEvent(event);
}

class WHMenuIcon extends HTMLElement {
	constructor() {
		super();

	}
	public connectedCallback() {
		this.slot = "icon";
	}
}
customElements.define("wh-menu-icon", WHMenuIcon);


class WHMenuCheck extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<style>
		
		:host{
			
				
			display: flex;
			align-items: center;
			justify-content: center;
			
			
		}
		</style>
		<slot></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "check";
	}
}
customElements.define("wh-menu-check", WHMenuCheck);

class WHMenuCaption extends HTMLElement {
	constructor() {
		super();
	}
	public connectedCallback() {
		this.slot = "caption";
	}
}
customElements.define("wh-menu-caption", WHMenuCaption);

class WHMenuGroup extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./css/WHMenuItem.css">
		<slot name="item"></slot>	
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "group";
	}
}

customElements.define("wh-menu-group", WHMenuGroup);


class WHMenuLink extends HTMLElement {

	static get observedAttributes() {
		return ["sub-menu"];
	}
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
		<link rel="stylesheet" href="./css/WHMenuItem.css">
			<slot name="check"></slot>
			<slot name="icon"></slot>
			<slot name="caption"></slot>
			<slot name="ind"></slot>
		
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slotCheck = this.shadowRoot.querySelector(`slot[name="check"]`);

		slotCheck.addEventListener("slotchange", (e) => { });

		/*
		const checkbox = $(this.shadowRoot).query(`input[type="checkbox"]`);

		checkbox.on("click", (event) => {

			this.checked = checkbox.get()['checked'];
			//dispatchEvent(this, "link-check", this);

		});

		*/
	}
	public connectedCallback() {
		this.slot = "link";
	}


	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

		switch (name) {
			case "sub-menu":
				if (this.hasAttribute("sub-menu")) {

					this._setSubMenu();
				}
				break;


		}
	}


	_setSubMenu() {

		$(this).create("div").attr("slot", "ind");
	}

	set subMenu(value) {
		if (Boolean(value)) {
			this.setAttribute("sub-menu", "");
		} else {
			this.removeAttribute("sub-menu");
		}
	}

	get subMenu() {
		return this.hasAttribute("sub-menu")
	}
}
customElements.define("wh-menu-link", WHMenuLink);


class WHMenuItem extends HTMLElement {


	_request = null;

	static get observedAttributes() {
		return ["onaction", "usecheck", "oncheck", "value", "disabled", "checked", "onlinkaction", "opened", "hidden"];
	}

	
	constructor() {

		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
			<link rel="stylesheet" href="./css/WHMenuItem.css">
			<slot name="link"></slot>
			<slot name="group"></slot>
			
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));


		const slotLink = this.shadowRoot.querySelector(`slot[name="link"]`);

		slotLink.addEventListener("slotchange", (event) => {
			const checkbox = $(this._getCheckbox());

			if (checkbox) {
				checkbox.on("click", (event) => {

					this.checked = event.target.checked;
					//dispatchEvent(this, "link-check", this);

				});

				if (!this.hasAttribute("checked")) {

					checkbox.prop("checked", false);
				}

			}

			const link = $(this).query(`wh-menu-link`);

			link.get<HTMLElement>().addEventListener("click", (event) => {


				if (event.target && event.target["type"] === "checkbox") {
					dispatchEvent(this, "link-check", this);
					return;
				}

				if ($(this).hasClass("sub-menu")) {

					if (!this.opened) {

						const items = Array.from(this.parentElement.querySelectorAll(`:scope > wh-menu-item`));

						items.forEach(item => {
							item["opened"] = false;
						})
					}



					this.opened = !this.opened;
				}

				dispatchEvent(this, "link-action", this);
				return;


				const myCheckbox = event.composedPath()[0] as HTMLInputElement;

				if (myCheckbox.getAttribute("type") !== "checkbox") {
					dispatchEvent(this, "link-action", this);

					if ($(this).hasClass("sub-menu")) {

						if (!this.opened) {
							const parent = this.parentElement;
							const items = Array.from(this.parentElement.querySelectorAll(`:scope > wh-menu-item`));

							items.forEach(item => {
								item["opened"] = false;
							})
						}



						this.opened = !this.opened;
					}
				}


			});



		});

		const slot:HTMLSlotElement = this.shadowRoot.querySelector(`slot[name="group"]`);



		//



		slot.addEventListener("slotchange", (event) => {

			console.log("group")
			$(this).removeClass("sub-menu");

			[...slot.assignedElements()].forEach(e => {

				$(this).addClass("sub-menu");


				const link = $(this).query(`wh-menu-link`);
				link.prop("subMenu", true);

				//const x = this.shadowRoot.querySelector(`slot[name="group"]`);
				//console.log(x.assignedSlot)
			})

		});

		


	}

	handleEvent(event) {
        if (event.type == "click") {
			
			if(this.request){
				const customEvent = new CustomEvent("app-request", {
                    detail: this.request,
                    cancelable: true,
                    bubbles: true,
                });
                this.dispatchEvent(customEvent);
			}
		}
	}
	public connectedCallback() {

		this.slot = "item";

		$(this).on("click", this);
		return;
		$(this).on("click", event=>{
			console.log(event)
			if(this.request){
				this.send()
			}
		})

	}

	public disconnectedCallback(){
		$(this).off("click", this);
	}


	public attributeChangedCallback(name, oldValue, newValue) {

		switch (name) {
			case "value":
				break;
			case 'checked':
				this._updateCheckbox(newValue);
				break;
			case 'disabled':
				break;
			case 'visible':
				break;
			case 'use-check':
				break;
			case 'use-icon':
				break;
			case 'appRequest':
				break;
			case 'onaction':
				$(this).on("link-action", $.bind(newValue, this, "event"));
				break;
			case 'oncheck':
				$(this).on("link-check", $.bind(newValue, this, "event"));
				break;
		}
	}

	set value(value) {
		this.setAttribute("value", value);
	}

	get value() {
		return this.getAttribute("value")
	}


	set request(value) {
		if(typeof value === "object"){
			this.setAttribute("request", JSON.stringify(value));
		}else{
			this.setAttribute("request", value);
		}
		
	}

	get request() {
		return JSON.parse(this.getAttribute("request"))
	}
	

	set useIcon(value) {

		if (Boolean(value)) {
			this.setAttribute("use-icon", "");
		} else {
			this.removeAttribute("use-icon");
		}

	}

	get useIcon() {
		return this.hasAttribute('use-icon')
	}

	set useCheck(value) {

		if (Boolean(value)) {
			this.setAttribute("use-check", "");
		} else {
			this.removeAttribute("use-check");
		}
	}

	get useCheck() {
		return this.hasAttribute('use-check')
	}

	set checked(value) {

		if (Boolean(value)) {
			this.setAttribute("checked", "");
		} else {
			this.removeAttribute("checked");
		}
	}

	get checked() {

		const checkbox = this.querySelector(`:scope > wh-menu-link > wh-menu-check input`) as HTMLInputElement;
		if (checkbox) {
			return checkbox.checked;
		}

		return false;
	}

	set disabled(value) {
		if (Boolean(value)) {
			this.setAttribute("disabled", "");
		} else {
			this.removeAttribute("disabled");
		}
	}

	get disabled() {
		return this.hasAttribute('disabled')
	}

	set hidden(value) {
		if (Boolean(value)) {
			this.setAttribute("hidden", "");
		} else {
			this.removeAttribute("hidden");
		}
	}

	get hidden() {
		return this.hasAttribute('hidden')
	}

	set opened(value) {
		if (Boolean(value)) {
			this.setAttribute("opened", "");
		} else {
			this.removeAttribute("opened");
		}
	}

	get opened() {
		return this.hasAttribute('opened')
	}

	set hideIcon(value) {

		if (Boolean(value)) {
			this.setAttribute("hide-icon", "");
		} else {
			this.removeAttribute("hide-icon");
		}
	}

	get hideIcon() {

		return this.hasAttribute('hide-icon')
	}

	set hideCheck(value) {
		if (Boolean(value)) {
			this.setAttribute("hide-check", "");
		} else {
			this.removeAttribute("hide-check");
		}
	}

	get hideCheck() {
		return this.hasAttribute('hide-check')
	}

	set dataSource(source) {

		this.innerHTML = "";

		$(this).create("wh-menu-link");
		for (let key in source) {
			this[key] = source[key];
		}
	}

	set icon(info) {

		$(this.querySelector(`:scope > wh-menu-link`)).create("wh-menu-icon").html(info);
	}

	set caption(info) {
		$(this.querySelector(`:scope > wh-menu-link`)).create("wh-menu-caption").html(info);
	}

	set checkbox(value) {
		if (value) {

			$(this.querySelector(`:scope > wh-menu-link`)).create("wh-menu-check").html(`<input type="checkbox">`);
			if (value === "checked") {
				this.checked = true;
			}


		}
	}

	set items(items) {

		const group = $(this).create("wh-menu-group");


		items.forEach((info, index) => {

			if (!info.icon) {
				info.icon = "";
			}

			if (this.checkbox) {

				info.useCheck = this.checkbox;
			}


			const item = $(group).create("wh-menu-item").get();



			item["dataSource"] = info;
		});


	}

	set events(events) {


		for (let key in events) {
			$(this).on(key, $.bind(events[key], this, "event"));
		}

	}

	set addClass(className) {
		$(this).addClass(className);
	}
	set removeClass(className) {
		$(this).removeClass(className);
	}

	

	

	_getCheckbox() {
		return this.querySelector(`:scope > wh-menu-link > wh-menu-check input`) as HTMLInputElement
	}
	_updateCheckbox(value) {

		const checkbox = this._getCheckbox();
		if (checkbox) {
			checkbox.checked = this.hasAttribute("checked");
		}

	}

	public getApp1() {
		return getParentElement(this, "wh-app") as App;
	}

	public whenApp() {

		

	}

	getApp():Sevian {
        return this.closest("._main_app_");
    }

    send() {
        const app = this.getApp();
        if (app) {
            const request = this.request
            

            app.send(request);
        }else{
            console.log("request don't exists!");
        }
    }
}

customElements.define("wh-menu-item", WHMenuItem);



class WHMenu extends HTMLElement {
	static get observedAttributes() {
		return ["checkbox", "mode", "hide-icon", "hide-check"];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
		<link rel="stylesheet" href="./css/WHMenu.css">
		<slot name="item"></slot>

		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			if (this.hasAttribute("hide-icon")) {
				this.setAttributeItems("hide-icon", this.hasAttribute("hide-icon"));
			} else {
				this.removeAttributeItems("hide-icon");
			}

			if (this.hasAttribute("hide-check")) {
				this.setAttributeItems("hide-check", "");
			} else {
				this.removeAttributeItems("hide-check");
			}




		});

	}


	public connectedCallback() {


	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

		switch (name) {
			case 'hide-icon':
				if (this.hasAttribute("hide-icon")) {
					this.setAttributeItems("hide-icon", this.hasAttribute("hide-icon"));
				} else {
					this.removeAttributeItems("hide-icon");
				}
				this.setAttributeItems("hide-icon", this.getAttribute("hide-icon"));
				break;

			case 'hide-check':
				if (this.hasAttribute("hide-check")) {
					this.setAttributeItems("hide-check", "");
				} else {
					this.removeAttributeItems("hide-check");
				}
				break;
		}
	}

	set dataSource(dataSource) {
		this.innerHTML = "";
		$(this).style("visibility", "hidden");

		this.hideCheck = dataSource.hideCheck || false;
		this.hideIcon = dataSource.hideIcon || false;
		this.checkbox = dataSource.checkbox || false;

		if (dataSource.addClass) {
			this.addClass = dataSource.addClass
		}

		if (dataSource.items) {
			this.loadItems(this, dataSource.items);
		}

		if (dataSource.events) {
			for (let key in dataSource.events) {
				this.addEventListener(key, $.bind(dataSource.events[key], this, "event"))
			}
		}

		$(this).style("visibility", "");
	}


	public loadItems(menu, items) {
		let item;
		let icon;
		let caption;

		items.forEach((info, index) => {
			if (!info.icon) {
				info.icon = "";
			}

			if (this.checkbox) {

				info.useCheck = this.checkbox;
			}


			item = $(menu).create("wh-menu-item");



			item.get().dataSource = info;
			/*item.addClass(info.addClass || null);
			item.prop("action", info.action || null);
			item.prop("checkbox", this.checkbox || null);
			icon = item.create("wh-icon").html(info.icon || "");
			caption = item.create("wh-caption").html(info.caption || "");

			*/

			return;
			if (info.events) {

				for (let key in info.events) {
					item.on(key, $.bind(info.events[key], item.get(), "event"));
				}
			}
			if (info.items) {
				const group = item.create("wh-group");
				this.loadItems(group, info.items);
			}

		});
	}

	set checkbox(value) {

		if (Boolean(value)) {
			this.setAttribute("checkbox", "");
		} else {
			this.removeAttribute("checkbox");
		}
	}

	get checkbox() {

		return this.hasAttribute('checkbox')
	}


	set hideIcon(value) {
		if (Boolean(value)) {
			this.setAttribute("hide-icon", "");
		} else {
			this.removeAttribute("hide-icon");
		}
	}

	get hideIcon() {
		return this.hasAttribute('hide-icon')
	}

	set hideCheck(value) {
		if (Boolean(value)) {
			this.setAttribute("hide-check", "");
		} else {
			this.removeAttribute("hide-check");
		}
	}

	get hideCheck() {
		return this.hasAttribute('hide-check')
	}


	_allItems() {
		return Array.from(this.querySelectorAll('wh-menu-item'));
	}

	setAttributeItems(attr, value) {
		const items = this._allItems();
		items.forEach(item => {
			item.setAttribute(attr, value);
		});
	}
	removeAttributeItems(attr) {
		const items = this._allItems();
		items.forEach(item => {
			item.removeAttribute(attr);
		});
	}



	classItems(className) {
		const items = this._allItems();
		items.forEach(item => {
			$(item).addClass(className);
		});
	}

	removeClassItems(className) {
		const items = this._allItems();
		items.forEach(item => {
			$(item).removeClass(className);
		});
	}

	set addClass(className) {
		$(this).addClass(className);
	}
	set removeClass(className) {
		$(this).removeClass(className);
	}
	/*
	public getApp() {
		return getParentElement(this, "wh-app");
	}

	*/
	
}

customElements.define("wh-menu", WHMenu);