import { Q as $, QElement } from "../Q.js";

class Paginator extends HTMLElement {
    static get observedAttributes() {
        return ["pages", "page", "max-pages"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
                border:1px solid white;
                width:100%;
				display:flex;
                cursor:pointer;
                user-select: none;

			}

            ::slotted(.page){
                border:1px solid white;
                display:inline-block;
                width:30px;
                height:30px;
                color:yellow!important;
                font-size:1rem!important;
                text-align: center;
                line-height:30px!important;
                
                letter-spacing: normal;
                text-transform: none;
            }
            ::slotted(.page:hover){
                background-color:#450010;
            }
            ::slotted(.page.selected){
                background-color:#459610;
            }
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    fireEvent(detail) {

        const customEvent = new CustomEvent("paginator-event", {
            detail:{...detail,
                type:"change"
            },
            cancelable: true,
            bubbles: true,
        });

        this.dispatchEvent(customEvent);
    }
    handleEvent(event) {
        const target: HTMLElement = event.target;

        if (event.type === "change" && target.tagName === "SELECT") {
            this.fireEvent({ page: (<HTMLInputElement>target).value });
        } else if (event.type === "click" && target.classList.contains("page")) {
            this.fireEvent({ page: target.dataset.page });
        } else if (event.type === "keydown") {
            switch (event.code) {
                case "ArrowRight":
                    this._next();
                    break;
                case "ArrowLeft":
                    this._prev();
                    break;
            }
        }
    }

    public connectedCallback() {
        this.slot = "paginator";
        this.setAttribute("tabindex", "-1");
        $(this).on("click", this);
        $(this).on("change", this);
        $(this).on("keydown", this);
    }

    public disconnectedCallback() {
        $(this).off("click", this);
        $(this).off("change", this);
        $(this).off("keydown", this);
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "pages":
            case "page":
            case "max-pages":
                this.doPage();
                break;
        }
    }

    doPage() {
        this.innerHTML = "";
        const maxPages = +this.maxPages || 6;
        const pages = +this.pages || 99;
        const page = +this.page || 44;

        const zone = Math.floor((page - 1) / maxPages);

        const firstPage = maxPages * zone + 1;
        const prevPage = page > 1 ? page - 1 : 1;
        const nextPage = page < pages ? page + 1 : pages;

        let lastPage = maxPages * (zone + 1);
        if (lastPage > pages) {
            lastPage = pages;
        }

        $(this).create("span").addClass(["ss-symbols", "page", "first-page"]).ds("page", 1).text("first_page");
        $(this)
            .create("span")
            .addClass(["ss-symbols", "page", "prev-page"])
            .ds("page", prevPage)
            .text("navigate_before");
        for (let i = firstPage; i <= lastPage; i++) {
            $(this)
                .create("a")
                .ds("page", i)
                .addClass(("page" + (i == page ? " selected" : "")).split(" "))
                .text(i);
        }

        $(this).create("span").addClass(["ss-symbols", "page", "next-page"]).ds("page", nextPage).text("navigate_next");
        $(this).create("span").addClass(["ss-symbols", "page", "last-page"]).ds("page", pages).text("last_page");

        if (pages / maxPages > 1) {
            const select = $.create("select");

            $(this).append(select);

            for (let i = 1; i <= pages; i = i + maxPages) {
                const opt = select.create("option");
                opt.value(i.toString());
                opt.html(i.toString());
                if (page >= i && page < i + maxPages) {
                    opt.attr("selected", true);
                }
            }
        }
    }

    _next() {
        if (+this.page < +this.pages) {
            const page = +this.page + 1;
            this.page = page.toString();
            this.fireEvent({ page: this.page });
        }
    }

    _prev() {
        if (+this.page > 1) {
            const page = +this.page - 1;
            this.page = page.toString();
            this.fireEvent({ page: this.page });
        }
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

    set pages(value) {
        if (Boolean(value)) {
            this.setAttribute("pages", value);
        } else {
            this.removeAttribute("pages");
        }
    }

    get pages() {
        return this.getAttribute("pages");
    }

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

    set maxPages(value) {
        if (Boolean(value)) {
            this.setAttribute("max-pages", value);
        } else {
            this.removeAttribute("max-pages");
        }
    }

    get maxPages() {
        return this.getAttribute("max-pages");
    }
}

customElements.define("ss-paginator", Paginator);
