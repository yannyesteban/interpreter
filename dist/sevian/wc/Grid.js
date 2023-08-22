import { Q as $ } from "../Q.js";
import "./Paginator.js";
class GridSearcher extends HTMLElement {
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
            @font-face {
                font-family: 'Material Symbols Outlined';
                font-style: normal;
                font-weight: 100 700;
                src: url(./fonts/google1.woff2) format('woff2');
              }
              
              .material-symbols-outlined {
                color:#444444;
                font-family: 'Material Symbols Outlined';
                font-weight: normal;
                font-style: normal;
                font-size: 12px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -moz-font-feature-settings: 'liga';
                
              }
			</style><slot></slot><input type="text"><button><span class="material-symbols-outlined">
            search
            </span></button>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
}
customElements.define("ss-grid-searcher", GridSearcher);
class GridCell extends HTMLElement {
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
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
}
customElements.define("ss-grid-cell", GridCell);
class GridRow extends HTMLElement {
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
			</style>
            
            <slot></slot>`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set selected(value) {
        if (Boolean(value)) {
            this.setAttribute("selected", value);
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.getAttribute("selected");
    }
}
customElements.define("ss-grid-row", GridRow);
class Grid extends HTMLElement {
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
    connectedCallback() {
        console.log("connectedCallback");
        this.addEventListener("click", (event) => {
            const target = event.target;
            if (target.tagName === "INPUT" && target.type == "radio") {
                if (this._lastChecked) {
                    this._lastChecked.checked = false;
                    this._lastChecked.closest("ss-grid-row").removeAttribute("selected");
                }
                this._lastChecked = target;
                this._lastChecked.closest("ss-grid-row").setAttribute("selected", "");
            }
            if (target.tagName === "INPUT" && target.type == "checkbox") {
                if (target.classList.contains("cell-header")) {
                    const rows = Array.from(this.querySelectorAll("ss-grid-row:not(.header-row)"));
                    const checkboxes = Array.from(this.querySelectorAll("ss-grid-row:not(.header-row) .cell-select input"));
                    if (target.checked) {
                        rows.forEach((row) => row.setAttribute("selected", ""));
                        checkboxes.forEach((check) => (check.checked = true));
                    }
                    else {
                        rows.forEach((row) => row.removeAttribute("selected"));
                        checkboxes.forEach((check) => (check.checked = false));
                    }
                }
                else {
                    if (target.checked) {
                        target.closest("ss-grid-row").setAttribute("selected", "");
                    }
                    else {
                        target.closest("ss-grid-row").removeAttribute("selected");
                    }
                }
                const selected = Array.from(this.querySelectorAll("ss-grid-row[selected]"));
                if (selected.length == 1) {
                    this.setAttribute("selected", "one");
                }
                else if (selected.length > 1) {
                    this.setAttribute("selected", "multiple");
                }
                else {
                    this.removeAttribute("selected");
                }
            }
            //console.log(event.target);
        });
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set type(value) {
        if (Boolean(value)) {
            this.setAttribute("type", value);
        }
        else {
            this.removeAttribute("type");
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set modeSelect(value) {
        if (Boolean(value)) {
            this.setAttribute("mode-select", value);
        }
        else {
            this.removeAttribute("mode-select");
        }
    }
    get modeSelect() {
        return this.getAttribute("mode-select");
    }
    set dataSource(source) {
        console.log("dataSource");
        let columnsNumber = source.fields.length;
        if (this.modeSelect == "checkbox" || this.modeSelect == "radio") {
            columnsNumber++;
        }
        this.style.setProperty("--grid-columns", columnsNumber);
        const data = source.data;
        $(this).create("ss-grid-searcher");
        const body = $(this).create("section");
        this._createHeaderRow(body, source.fields);
        let i = 0;
        for (const line of data) {
            this._createRow(body, source.fields, line, ++i);
        }
        $(this)
            .create("ss-paginator")
            .attr("page", "1")
            .attr("pages", "88")
            .attr("max-pages", "8")
            .on("page-change", (event) => {
            console.log(event.detail);
            event.target.page = event.detail.page;
        });
    }
    _createHeaderRow(body, fields) {
        const row = body.create("ss-grid-row");
        row.addClass("header-row");
        if (this.modeSelect == "checkbox" || this.modeSelect == "radio") {
            const cell = row.create("ss-grid-cell");
            cell.addClass(["cell-select", "cell-header"]);
            const check = cell.create("input");
            check.attr("type", this.modeSelect);
            check.addClass("cell-header");
        }
        for (const field of fields) {
            const cell = row.create("ss-grid-cell");
            cell.addClass("cell-header");
            cell.text(field.label);
        }
    }
    _createRow(body, fields, data, index) {
        const row = body.create("ss-grid-row");
        row.addClass("row");
        if (this.modeSelect == "checkbox" || this.modeSelect == "radio") {
            const cell = row.create("ss-grid-cell");
            cell.addClass("cell-select");
            const check = cell.create("input");
            check.attr("type", this.modeSelect);
            check.attr("nid", index);
        }
        for (const field of fields) {
            const cell = row.create("ss-grid-cell");
            cell.text(data[field.name]);
        }
    }
}
customElements.define("ss-grid", Grid);
//# sourceMappingURL=Grid.js.map