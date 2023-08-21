import { Q as $ } from "../Q.js";


export class WHGridCaption extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "caption";
	}
}
customElements.define("wh-grid-caption", WHGridCaption);

export class WHGridCell extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "cell";
	}

	set value(value) {

		if (Boolean(value)) {
			this.setAttribute("value", value);
		} else {
			this.removeAttribute("value");
		}
	}

	get value() {

		return this.getAttribute("value")
	}

	set hidden(value) {

		if (Boolean(value)) {
			this.setAttribute("hidden", "");
		} else {
			this.removeAttribute("hidden");
		}
	}

	get hidden() {

		return this.hasAttribute("hidden")
	}


	set field(value) {

		if (Boolean(value)) {
			this.setAttribute("field", value);
		} else {
			this.removeAttribute("field");
		}
	}

	get field() {

		return this.getAttribute("field")
	}


	public render() {
		if (this.hasAttribute("value")) {
			this.innerHTML = this.getAttribute("value");
		}
	}
}
customElements.define("wh-grid-cell", WHGridCell);


export class WHGridRow extends HTMLElement {

	static get observedAttributes() {
		return ["select-mode", "selected"];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<div class="input"><input type="checkbox"></div><slot name="cell"></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		console.log("connectedCallback");
		this.slot = "row";

		this._click = this._click.bind(this);
		$(this.shadowRoot.querySelector(`input`)).on("click", this._click);


	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
		$(this.shadowRoot.querySelector(`input`)).off("click", this._click);
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

		switch (name) {
			case "select-mode":
				this._selectMode(newVal);
				break;
			case "selected":
				this._selectInput();
				break;


		}
	}

	set selected(value) {
		console.log("set selected")
		if (Boolean(value)) {
			this.setAttribute("selected", "");
		} else {
			this.removeAttribute("selected");
		}
	}

	get selected() {

		return this.hasAttribute("selected");
	}

	set selectMode(value) {
		console.log("set selectMode")
		if (Boolean(value)) {
			this.setAttribute("select-mode", value);
		} else {
			this.removeAttribute("select-mode");
		}
	}

	get selectMode() {

		return this.getAttribute("select-mode")
	}

	_link() {
		if (this.hasAttribute("select-mode")) {
			this.shadowRoot.querySelector(`input`).removeAttribute("hidden");
		}
	}

	_click(event) {
		console.log("_click")
		this.selected = event.target.checked;

		$(this).fire("row-check", event.target.checked);

	}

	_selectMode(value) {
		switch (value) {
			case "one":
				$(this.shadowRoot.querySelector(`input`)).attr("type", "radio");
				break;
			case "multi":
				$(this.shadowRoot.querySelector(`input`)).attr("type", "checkbox");
				break;

		}
	}

	_selectInput() {

		this.shadowRoot.querySelector(`input`).checked = this.selected;
	}

	set data(data) {

	}

	get data() {

		const data = this._allCell().reduce((e, i: WHGridCell) => {
			e[i.field] = i.value;
			return e;

		}, {});

		return data;
	}

	_allCell() {
		return Array.from(this.querySelectorAll(`wh-grid-cell`))
	}
}
customElements.define("wh-grid-row", WHGridRow);

export class WHGrid extends HTMLElement {
	_fields = [];
	_rowValues = [];
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot name="caption"></slot>
		<div class="grid"><slot name="row"></slot></div>
		<slot></slot>

		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

	}

	static get observedAttributes() {
		return [""];
	}

	public connectedCallback() {
		//https://fionnachan.medium.com/dynamic-number-of-rows-and-columns-with-css-grid-layout-and-css-variables-cb8e8381b6f2
		//document.documentElement.style.setProperty("--rowNum", 6);

		//let htmlStyles = window.getComputedStyle(document.querySelector("html"));
		//let rowNum = parseInt(htmlStyles.getPropertyValue("--rowNum"));


		$(this).on("click", (event) => {
			let row = null;
			const comp = event.composedPath()[0];
			if (comp && comp.getAttribute("type") === "checkbox") {
				console.log(comp, comp.checked);


				$(this).fire("grid-row-check", { selected: comp.checked, data: event.target.data, row: event.target });
			}

			if (comp && comp.getAttribute("type") === "radio") {

				const rows = Array.from(this.querySelectorAll(`wh-grid-row`));

				rows.forEach((row: WHGridRow) => {

					if (event.target !== row) {
						row.selected = false;
					}
				})

				$(this).fire("grid-row-check", { selected: comp.checked, data: event.target.data });
			}

			if (event.target.tagName === "wh-grid-cell".toUpperCase()) {
				row = event.target.parentNode;
				$(this).fire("grid-cell-click", { selected: row.selected, data: row.data, cell: event.target });
				$(this).fire("grid-row-click", { selected: row.selected, data: row.data, row });

			}

		});

		$(this).on("grid-row-click", event => {
			console.log(event.detail)
		});

		$(this).on("grid-row-check", event => {
			console.log(event.detail)
		})

	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}


	set selectMode(value) {
		console.log("set selected")
		if (Boolean(value)) {
			this.setAttribute("select-mode", value);
		} else {
			this.removeAttribute("select-mode");
		}
	}

	get selectMode() {

		return this.getAttribute("select-mode");
	}

	set dataSource(source) {
		this.innerHTML = "";


		if (source.selectMode) {
			this.selectMode = source.selectMode;
		}
		if (source.caption) {
			this._createCaption(source.caption);
		}
		if (!source.fields) {
			return;
		}

		this.rowValues = source.rowValues || [];

		this._fields = source.fields;
		const ncols = source.fields.filter(f => !f.hidden);

		this._setGridColumn(ncols.length);


		console.log(ncols.length)

		if (source.fields) {
			this._craeteHeaderRow(source.fields);
		}
		if (source.data) {
			source.data.forEach(info => {
				this.append(this.createRow(info));
			})
		}
	}

	appendFirst(row){
		

		const header = this.querySelector(`[role="header"]`);
		if(header){
			
			header.insertAdjacentElement("afterend", row);
		}else{
			//this.insertAdjacentElement("afterbegin", row);
			this.append(row);
		}
		
	}
	_createCaption(caption) {
		$(this).create("wh-grid-caption").html(caption);
	}

	_craeteHeaderRow(info) {
		const row = $(this).create("wh-grid-row").addClass("header");
		row.attr("role", "header");
		row.prop("selectMode", this.selectMode);

		

		info.forEach(data => {

			row.create("wh-grid-cell").attr("hidden", data.hidden || false).ds("field", data.name).html(data.caption);
		});

	}
	createRow(info):HTMLElement {
		const row = $.create("wh-grid-row").addClass("row");
		row.prop("selectMode", this.selectMode);

		this.rowValues.forEach(key=>{
			row.ds(key, info[key]);
		});

		this._fields.forEach(field=>{
			row.create("wh-grid-cell")
			.attr("hidden", field.hidden || false)
			.attr("field", field.name || null)
			.attr("value", info[field.name] || null)
			.html(info[field.name] || "");
		});

		return row.get();
	}

	_getAllRows() {
		return [... this.querySelectorAll(`wh-grid-row.row`)];
	}

	_getSelectedRows() {
		return [... this.querySelectorAll(`wh-grid-row[selected]`)];
	}

	_getRowValues(row) {
		const cells = [...row.querySelectorAll(`wh-grid-cell`)] as WHGridCell[];
		const data = {};
		cells.forEach(cell => {
			data[cell.field] = cell.value;
		});
		return data;
	}
	get value() {

		return this._getSelectedRows().reduce((sum, row: WHGridRow) => {
			sum.push(row.data);
			return sum;
		}, []);
	}

	get data() {
		return this._getAllRows().reduce((sum, row: WHGridRow) => {
			sum.push(row.data);
			return sum;
		}, []);
	}

	set rowValues(values){
		this._rowValues = values;
	}
	get rowValues(){
		return this._rowValues;
	}


	set rowData(data){
		this.createRow(data);
	}

	_setGridColumn(n) {
		let htmlStyles = window.getComputedStyle(document.querySelector("html"));
		//let rowNum = parseInt(htmlStyles.getPropertyValue("--grid-columns"));
		//document.documentElement.style.setProperty("--grid-columns", "5");

		const delta = (this.selectMode == "one" || this.selectMode == "multi")? 1 : 0;
		this.style.setProperty("--grid-columns", n + delta);
	}
	_fixColumn() {

		let htmlStyles = window.getComputedStyle(document.querySelector("html"));
		//let rowNum = parseInt(htmlStyles.getPropertyValue("--grid-columns"));
		//document.documentElement.style.setProperty("--grid-columns", "5");
		this.style.setProperty("--grid-columns", "5");
	}

}

customElements.define("wh-grid", WHGrid);