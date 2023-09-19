import { AppRequest } from "./AppRequest.js";
import { Q as $, QElement } from "../Q.js";

import "./Paginator.js";
import "./Win.js";
import "./Menu.js";
import { WHWin, WHWinBody, WHWinHeader } from "./Win.js";
import { Sevian } from "./Sevian.js";
import { Obj } from "../../core/Expressions.js";

class GridBar extends HTMLElement {
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

    public connectedCallback() {}

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
}

customElements.define("ss-grid-bar", GridBar);

class GridCaption extends HTMLElement {
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

    public connectedCallback() {}

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
}

customElements.define("ss-grid-caption", GridCaption);

class GridSearcher extends HTMLElement {
    static get observedAttributes() {
        return ["text"];
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

    public connectedCallback() {
        this.shadowRoot.querySelector("button").addEventListener("click", () => {
            const event = new CustomEvent("search", {
                detail: {
                    text: (<HTMLInputElement>this.shadowRoot.querySelector("input")).value,
                },
                cancelable: true,
                bubbles: true,
            });

            this.dispatchEvent(event);
        });
    }

    public disconnectedCallback() {}

    public attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "text":
                (<HTMLInputElement>this.shadowRoot.querySelector("input")).value = newVal;
                break;
        }
    }

    set text(value) {
        if (Boolean(value)) {
            this.setAttribute("text", value);
        } else {
            this.removeAttribute("text");
        }
    }

    get text() {
        return this.getAttribute("text");
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

    public connectedCallback() {}

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

    handleEvent(event) {
        if (event.type == "click") {
            $(this).fire("grid-row-click", { row: this, selected: this.selected });
        }
    }

    public connectedCallback() {
        $(this).on("click", this);
    }

    public disconnectedCallback() {
        $(this).off("click", this);
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

    set selected(value) {
        if (Boolean(value)) {
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    get selected() {
        return this.hasAttribute("selected");
    }
}

customElements.define("ss-grid-row", GridRow);

class Grid extends HTMLElement {
    barInfo = " página {page} de {pages}, {records} registros";
    modeAction: number = 1;

    defaultAction = "edit-record";

    //select-mode = "checkbox", "radio", "none", "simple", "multiple"
    //search-mode = "none", "simple"
    //bar-info
    //action-buttons:[{delete, edit}]

    _lastChecked;
    _actions: {
        title: string;
        action: string;
    }[];
    task: any;
    maxPages;
    records;

    _maxPages;
    _records;
    _limit;
    _pages;
    _page;

    private appRequests;
    private _filter: any;
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

            ::slotted(ss-grid-searcher){
                
            }
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            let c = 0;
            let str = `[p${++c}]`;

            const rows: HTMLElement[] = Array.from(this.querySelectorAll("ss-grid-cell.cell-header:not([hidden])"));

            rows.forEach((row, index) => {
                const width = row.dataset.width || "auto";
                str += ` ${width} [p${++c}]`;
            });
            console.log(str);
            this.style.setProperty("--grid-columns", str);
            //const nodes = slot.assignedNodes();
        });
    }

    handleEvent(event: CustomEvent) {
        if (event.type == "search" && event instanceof CustomEvent) {
            this._filter = event.detail.text;
            const request = this.sendRequest("filter");
        }

        if (event.type == "page-select" && event instanceof CustomEvent) {
            const target: any = event.target;
            target.page = event.detail.page;

            this._page = event.detail.page;
            this.sendRequest("load-page");
            return;
        }

        if (event.type == "grid-row-click") {
            const row = event.detail.row;

            if (this.selectMode == "simple") {
                if (row.classList.contains("selected")) {
                    row.classList.remove("selected");
                    this.setRecord({});
                    return;
                }

                $(this)
                    .queryAll("ss-grid-row.row.selected")
                    .forEach((r) => r.removeClass("selected"));
                $(row).addClass("selected");
                this.setRecord(this.getDataRow(row));

                if (this.defaultAction) {
                    this.sendRequest(this.defaultAction);
                }
            }
            return;
        }

        if (event.type == "click") {
            const target: any = event.target;

            if (target.tagName === "INPUT" && target.type == "radio") {
                if (this._lastChecked) {
                    if (this._lastChecked == target) {
                        return;
                    }

                    this._lastChecked.checked = false;

                    this._lastChecked.closest("ss-grid-row").removeAttribute("selected");
                }
                this._lastChecked = target;
                this._lastChecked.closest("ss-grid-row").setAttribute("selected", "");

                this.setRecord(this.getDataRow(this._lastChecked.closest("ss-grid-row")));
            }

            if (target.tagName === "INPUT" && target.type == "checkbox") {
                if (target.classList.contains("cell-header")) {
                    const rows = Array.from(this.querySelectorAll("ss-grid-row:not(.header-row)"));
                    const checkboxes: HTMLInputElement[] = Array.from(
                        this.querySelectorAll("ss-grid-row:not(.header-row) .cell-select input"),
                    );
                    if (target.checked) {
                        rows.forEach((row) => row.setAttribute("selected", ""));
                        checkboxes.forEach((check) => (check.checked = true));
                    } else {
                        rows.forEach((row) => row.removeAttribute("selected"));
                        checkboxes.forEach((check) => (check.checked = false));
                    }
                } else {
                    if (target.checked) {
                        target.closest("ss-grid-row").setAttribute("selected", "");
                    } else {
                        target.closest("ss-grid-row").removeAttribute("selected");
                    }
                }
                const selected = Array.from(this.querySelectorAll("ss-grid-row[selected]"));

                if (selected.length == 1) {
                    this.setAttribute("selected", "one");
                } else if (selected.length > 1) {
                    this.setAttribute("selected", "multiple");
                } else {
                    this.removeAttribute("selected");
                }

                
            }
            return;
        }
    }
    public connectedCallback() {
        console.log("connectedCallback");
        this.style.setProperty("--grid-columns", "");

        $(this).on("page-select", this);
        $(this).on("grid-row-click", this);
        $(this).on("search", this);
        $(this).on("click", this);
    }

    public disconnectedCallback() {
        $(this).off("page-select", this);
        $(this).off("grid-row-click", this);
        $(this).off("search", this);
        $(this).off("click", this);
    }

    public attributeChangedCallback(name, oldVal, newVal) {}

    set page(value) {
        if (Boolean(value)) {
            this.setAttribute("page", value);
        } else {
            this.removeAttribute("page");
        }
    }

    get page() {
        return this.getAttribute("page");
    }

    set selectMode(value) {
        if (Boolean(value)) {
            this.setAttribute("select-mode", value);
        } else {
            this.removeAttribute("select-mode");
        }
    }

    get selectMde() {
        return this.getAttribute("select-mode");
    }

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

    set filter(value) {
        let filterElement = $(this).query("ss-grid-searcher");
        if (!filterElement) {
            filterElement = $(this).create("ss-grid-searcher");
        }

        filterElement.prop("text", value);
    }

    get filter() {
        let filterElement = $(this).query("ss-grid-searcher");

        return filterElement.prop("text");
    }

    set modeSelect(value) {
        if (Boolean(value)) {
            this.setAttribute("mode-select", value);
        } else {
            this.removeAttribute("mode-select");
        }
    }

    get modeSelect() {
        return this.getAttribute("mode-select");
    }

    set dataSource(source) {
        this.modeSelect = "checkbox";
        const maxPages = source.maxPages;
        const records = source.records;
        const limit = source.limit;
        const pages = Math.ceil(records / limit);

        this._maxPages = maxPages;
        this._records = records;
        this._limit = limit;
        this._pages = pages;
        this._page = source.page;

        //this.appRequests = source.appRequests;
        if (source.appRequests) {
            customElements.whenDefined("app-request").then((x) => {
                for (const [name, info] of Object.entries(source.appRequests)) {
                    const r = $(this).create("app-request").get<HTMLElement>();
                    r.setAttribute("name", name);
                    r.setAttribute("type", "json");
                    r["data"] = info;
                    console.log(info);
                }
            });
        }

        console.log("dataSource");
        /*
        Promise.all([
            customElements.whenDefined("wh-win"),
            customElements.whenDefined("wh-win-header"),
            customElements.whenDefined("wh-win-body"),
        ]).then(() => {
            const win: any = $(document.body).create("wh-win");

            //win.attr("width", "687px");
            //win.attr("height", "600px");

            //win.attr("top", "middle");
            //win.attr("mode", "custom");
            //win.attr("left", "center");

            win.attr("resizable", "");
            win.create("div").addClass("mydiv").html("hello div<br>uyastdutsy<br>aksdsañkdñl<br>sdjkdñ");

            win.attr("caption", "Ventana");
            //win.get().show()

            //win.attr("visibility", true)
            //$(document.body).append(win);
        });
        */

        if (source.caption) {
            this._setCaption(source.caption);
        }

        if (source.actions) {
            this._setBarAction(source.actions);
        }

        this._actions = source.actions;

        const data = source.data;

        $(this).create("ss-grid-searcher");

        const body = $(this).create("section");
        this._createHeaderRow(body, source.fields);

        let i = 0;
        for (const line of data) {
            this._createRow(body, source.fields, line, ++i);
        }

        $(this).create("ss-paginator").attr("page", source.page).attr("pages", pages).attr("max-pages", maxPages);

        this._createBarInfo();
        (<GridSearcher>this.querySelector("ss-grid-searcher")).text = source.filter || "";

        if (source.nav) {
            let nav: any = $(this).create("ss-nav").get();
            source.nav.context = this;
            nav.dataSource = source.nav;
        }
    }

    set pageData(info) {
        console.log(info, this.querySelector("ss-grid-searcher"));

        this.filter = info.filter;
        this._pages = Math.ceil(info.totalRecords / info.limit);
        this._records = info.totalRecords;
        $(this).query("ss-paginator").attr("page", info.page).attr("pages", this._pages);

        this._page = info.page;
        this._createBody(info.fields, info.data);
        this._createBarInfo();
        //(<GridSearcher>this.querySelector("ss-grid-searcher")).text =info.filter || ""
    }
    _setCaption(value) {
        let caption = $(this).query("ss-grid-caption");
        if (!caption) {
            caption = $(this).create("ss-grid-caption");
        }

        caption.text(value);
    }

    _setBarAction(actions) {
        const bar = $(this).create("ss-grid-bar");

        actions.forEach((a) => {
            bar.create("button").create("span").addClass("ss-symbols").text(a.title);
        });
    }

    _createHeaderRow(body, fields) {
        const row = body.create("ss-grid-row");
        row.addClass("header-row");
        if (this.modeSelect == "checkbox" || this.modeSelect == "radio") {
            const cell = row.create("ss-grid-cell");
            cell.addClass(["cell-select", "cell-header", "first-cell"]);
            cell.ds("width", "min-content");
            const check = cell.create("input");
            check.attr("type", this.modeSelect);
            check.addClass("cell-header");
        }

        for (const field of fields) {
            console.log(field);
            const cell = row.create("ss-grid-cell").ds("field", field.name || "");
            cell.addClass("cell-header");
            cell.text(field.label);
            if (field.type == "info") {
                cell.addClass("cell-info");
                cell.attr("hidden", "");
                //str += " " + (field.cellWidth || "0") + ` [p${++c}]`
            } else {
                const width = field.cellWidth || "auto";

                cell.ds("width", width);
            }
        }

        if (this._actions) {
            const cell = row.create("ss-grid-cell");
            cell.addClass("cell-header");
            //cell.ds("width", "fit-content")
            cell.text("-");
        }
    }
    _createRow(body, fields, data, index) {
        const row = body.create("ss-grid-row");
        row.addClass("row")
            .ds("key", data.__key_ || "")
            .ds("mode", data.__mode_ || "0");
        if (this.modeSelect == "checkbox" || this.modeSelect == "radio") {
            const cell = row.create("ss-grid-cell");
            cell.addClass(["cell-select", "first-cell"]);

            const check = cell.create("input");
            check.attr("type", this.modeSelect);
            check.attr("nid", index);
        }
        for (const field of fields) {
            const cell = row
                .create("ss-grid-cell")
                .ds("field", field.name || "")
                .ds("value", data[field.name] || "");
            cell.text(data[field.name]);
            if (field.type == "info") {
                cell.addClass("cell-info");
                cell.attr("hidden", "");
            }
        }

        if (this._actions) {
            const cell = row.create("ss-grid-cell");
            cell.addClass("cell-action");
            this._actions.forEach((a) => {
                cell.create("button").create("span").addClass("ss-symbols").text(a.title);
            });
        }
    }

    _createBody(fields, data) {
        let body = $(this).query("section");
        if (body) {
            body.html("");
        } else {
            body = $(this).create("section");
        }

        this._createHeaderRow(body, fields);

        let i = 0;
        for (const line of data) {
            this._createRow(body, fields, line, ++i);
        }
    }

    _createBarInfo() {
        let bar = $(this).query(".bar-info");
        if (!bar) {
            bar = $(this).create("div").addClass("bar-info");
        }
        //barInfo = " página {page} de {pages}, {records} registros";
        bar.html(
            this.evalTemplate(this.barInfo, {
                page: this._page,
                pages: this._pages,
                records: this._records,
            }),
        );
    }
    setAction(action) {
        alert(action);
    }

    newRecord() {}

    loadRecord() {}

    deleteRecords() {}
    /*
    getAppRequest(name: string): AppRequest {
        return this.querySelector(`app-request[name="${name}"]`);
    }
    */
    sendRequest(name) {

        if(this.modeSelect == "checkbox"){
            this.setRecords();
        }

        const info = this.getAppRequest(name)?.data;

        if (info) {
            info.form = this;

            const app: any = document.querySelector("._main_app_");

            app.send(info, {
                page: this._page || 1,
                filter: this._filter || "",
            });
        } else {
            console.log("request don't exists!");
        }
    }

    getApp(): Sevian {
        return this.closest("._main_app_");
    }

    getAppRequest(name: string): AppRequest {
        return this.querySelector(`app-request[name="${name}"]`);
    }

    evalTemplate(str, data) {
        str = str.replace(/{(\w+)}/g, (matched, index, original) => {
            console.log(index, matched);
            if (index !== 0) {
                return data[index];
            } else {
                return matched;
            }
        });

        return str;
    }

    getDataRow(row) {
        const data = { __mode_: row.dataset.mode, __key_: row.dataset.key };
        return Array.from(row.querySelectorAll("ss-grid-cell"))
            .filter((field: HTMLElement) => field.dataset?.field)
            .reduce((data, field: HTMLElement) => {
                data[field.dataset.field] = field.dataset.value;
                return data;
            }, data);
    }
    setRecords() {
        this.querySelectorAll("input[data-input-type='records']").forEach((i) => i.remove());

        const rows = Array.from(this.querySelectorAll("ss-grid-row[selected]"));
        const data = [];
        rows.forEach((row) => {
            data.push(this.getDataRow(row));
        });

        $(this)
            .create("input")
            .ds("inputType", "records")
            .prop("type", "text")
            .prop("name", "__data_")
            .value(JSON.stringify(data));
    }
    setRecord(data) {
        this.querySelectorAll("input[data-input-type='record']").forEach((i) => i.remove());

        data.__page_ = this._page;
        if (!data.__key_) {
            data.__key_ = "";
        }
        for (const [name, value] of Object.entries(data)) {
            $(this).create("input").ds("inputType", "record").prop("type", "text").prop("name", name).value(value);
        }
    }

    about() {
        alert("grid");
    }
}

//customElements.define("ss-win-header", WHWinHeader);
//customElements.define("ss-win-body", WHWinBody);
//customElements.define("ss-win", WHWin);
customElements.define("ss-grid", Grid);
