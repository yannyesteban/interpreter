import { Q as $ } from "../Q.js";
import "./Paginator.js";
import "./Win.js";
import "./Menu.js";
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
    connectedCallback() {
        this.shadowRoot.querySelector("button").addEventListener("click", () => {
            const event = new CustomEvent("search", {
                detail: {
                    text: this.shadowRoot.querySelector("input").value,
                },
                cancelable: true,
                bubbles: true,
            });
            this.dispatchEvent(event);
        });
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "text":
                this.shadowRoot.querySelector("input").value = newVal;
                break;
        }
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
        this.barInfo = " página {page} de {pages}, {records} registros";
        this.modeAction = 1;
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
            const rows = Array.from(this.querySelectorAll("ss-grid-cell.cell-header:not([hidden])"));
            rows.forEach((row, index) => {
                const width = row.dataset.width || "auto";
                str += ` ${width} [p${++c}]`;
            });
            console.log(str);
            this.style.setProperty("--grid-columns", str);
            //const nodes = slot.assignedNodes();
        });
    }
    connectedCallback() {
        this.style.setProperty("--grid-columns", "");
        console.log("connectedCallback");
        this.addEventListener("search", (event) => {
            //this.dispatchEvent(event)
            const request = this.getAppRequest("filter");
            request.store = {
                __page_: 1,
                __filter_: event.detail.text,
            };
            this.filter = event.detail.text;
            request.actions[0].params = Object.assign(Object.assign({}, (request.actions[0].params || {})), { filter: event.detail.text, page: 1 });
            console.log(request);
            this.send(request);
        });
        this.addEventListener("click", (event) => {
            const target = event.target;
            console.log(target);
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
            if (target.tagName === "SS-GRID-ROW" || target.tagName === "SS-GRID-CELL") {
                const row = target.closest("ss-grid-row");
                if (!$(row).hasClass("row")) {
                    return;
                }
                const request = this.getAppRequest("edit-record");
                request.store = {
                    __key_: row.dataset.key,
                    __mode_: row.dataset.mode,
                    __page_: this._page,
                };
                console.log(request);
                //this.send(request);
                $(this)
                    .queryAll("ss-grid-row.row.selected")
                    .forEach((r) => r.removeClass("selected"));
                $(row).addClass("selected");
                this.setRecord();
            }
            //console.log(event.target);
        });
        this.addEventListener("do-action", (event) => {
            const action = event.detail.action;
            const request = this.getAppRequest(action);
            request.form = this.closest("form");
            console.log(request);
            this.send(request);
        });
        this.addEventListener("do-request", (event) => {
            this.send(JSON.parse(event.detail.request));
        });
    }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldVal, newVal) { }
    set page(value) {
        if (Boolean(value)) {
            this.setAttribute("page", value);
        }
        else {
            this.removeAttribute("page");
        }
    }
    get page() {
        return this.getAttribute("page");
    }
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
        }
        else {
            this.removeAttribute("mode-select");
        }
    }
    get modeSelect() {
        return this.getAttribute("mode-select");
    }
    set dataSource(source) {
        const maxPages = source.maxPages;
        const records = source.records;
        const limit = source.limit;
        const pages = Math.ceil(records / limit);
        this._maxPages = maxPages;
        this._records = records;
        this._limit = limit;
        this._pages = pages;
        this._page = source.page;
        this.appRequests = source.appRequests;
        this.task = {
            new: {
                actions: [
                    {
                        window: "name",
                        id: "this",
                        element: "form",
                        name: "two",
                        method: "request",
                    },
                ],
            },
            load: {
                body: "this.getRecordKey()",
                actions: [
                    {
                        id: "this",
                        element: "form",
                        name: "two",
                        method: "load",
                    },
                ],
            },
            delete: {
                body: "this.selected()",
                actions: [
                    {
                        id: "this",
                        element: "form",
                        name: "two",
                        method: "delete",
                    },
                ],
            },
        };
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
        $(this)
            .create("ss-paginator")
            .attr("page", source.page)
            .attr("pages", pages)
            .attr("max-pages", maxPages)
            .on("page-select", (event) => {
            console.log(event.detail);
            event.target.page = event.detail.page;
            const request = this.getAppRequest("load-page");
            request.store = {
                __page_: event.detail.page,
            };
            request.actions[0].params = Object.assign(Object.assign({}, (request.actions[0].params || {})), { filter: this.filter, page: event.detail.page });
            console.log(request);
            this.send(request);
        });
        this._createBarInfo();
        this.querySelector("ss-grid-searcher").text = source.filter || "";
        if (source.nav) {
            let nav = $(this).create("ss-nav").get();
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
            }
            else {
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
            const cell = row.create("ss-grid-cell").ds("field", field.name || "");
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
        }
        else {
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
        bar.html(this.evalTemplate(this.barInfo, {
            page: this._page,
            pages: this._pages,
            records: this._records,
        }));
    }
    setAction(action) {
        alert(action);
    }
    newRecord() { }
    loadRecord() { }
    deleteRecords() { }
    /*
    getAppRequest(name: string): AppRequest {
        return this.querySelector(`app-request[name="${name}"]`);
    }
    */
    sendRequest(name) {
        var _a;
        const info = (_a = this.getAppRequest(name)) === null || _a === void 0 ? void 0 : _a.data;
        if (info) {
            info.form = this;
            const app = document.querySelector("._main_app_");
            app.send(info);
        }
        else {
            console.log("request don't exists!");
        }
    }
    getApp() {
        return this.closest("._main_app_");
    }
    send(request) {
        const app = this.getApp();
        if (app) {
            request.form = this.closest("form");
            app.send(request);
        }
        else {
            console.log("app don't found!");
        }
    }
    getAppRequest(name) {
        return this.appRequests[name];
    }
    evalTemplate(str, data) {
        str = str.replace(/{(\w+)}/g, (matched, index, original) => {
            console.log(index, matched);
            if (index !== 0) {
                return data[index];
            }
            else {
                return matched;
            }
        });
        return str;
    }
    setRecord() {
        this.querySelectorAll("input[data-input-type='record']").forEach((i) => i.remove());
        const row = this.querySelector("ss-grid-row.selected");
        const mode = row.dataset.mode;
        const key = row.dataset.key;
        const fields = Array.from(row.querySelectorAll("ss-grid-cell"));
        fields.forEach((field) => {
            $(this)
                .create("input")
                .ds("inputType", "record")
                .prop("type", "text")
                .prop("name", field.dataset.field)
                .value(field.innerHTML);
        });
        $(this).create("input").ds("inputType", "record").prop("type", "text").prop("name", "__mode_").value(mode);
        $(this).create("input").ds("inputType", "record").prop("type", "text").prop("name", "__key_").value(key);
        $(this).create("input").ds("inputType", "record").prop("type", "text").prop("name", "__page_").value(this._page);
    }
    about() {
        alert("grid");
    }
}
//customElements.define("ss-win-header", WHWinHeader);
//customElements.define("ss-win-body", WHWinBody);
//customElements.define("ss-win", WHWin);
customElements.define("ss-grid", Grid);
//# sourceMappingURL=Grid.js.map