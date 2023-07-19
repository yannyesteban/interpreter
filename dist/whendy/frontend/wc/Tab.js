var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _WHTab_lastIndex;
import { Q as $ } from "./../Q.js";
const KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    HOME: 36,
    END: 35,
};
function dispatchEvent(element, eventName, detail) {
    const event = new CustomEvent(eventName, {
        detail,
        cancelable: true,
        bubbles: true
    });
    element.dispatchEvent(event);
}
class WHTabMenu extends HTMLElement {
    static get observedAttributes() {
        return ["selected"];
    }
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHTab.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "menu";
        this.setAttribute("role", "tab");
        this.setAttribute("tabindex", "-1");
    }
    attributeChangedCallback() {
        const value = this.hasAttribute("selected");
        this.setAttribute("tabindex", value ? "0" : "-1");
    }
    set selected(value) {
        value = Boolean(value);
        if (value) {
            this.setAttribute("selected", "");
        }
        else {
            this.removeAttribute("selected");
        }
    }
    get selected() {
        return this.hasAttribute("selected");
    }
    set index(index) {
        this.setAttribute("index", index);
    }
    get index() {
        return this.getAttribute("index");
    }
}
customElements.define("wh-tab-menu", WHTabMenu);
class WHTabPanel extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../sass/WHTab.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "panel";
    }
    set index(index) {
        this.setAttribute("index", index);
    }
    get index() {
        return this.getAttribute("index");
    }
}
customElements.define("wh-tab-panel", WHTabPanel);
export class WHTab extends HTMLElement {
    constructor() {
        super();
        _WHTab_lastIndex.set(this, -1);
        const template = document.createElement("template");
        template.innerHTML = `
			<link rel="stylesheet" href="./../sass/WHTab.css">
			<slot name="menu"></slot>
			<slot name="panel"></slot>

			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            this._linkPanels();
            //const nodes = slot.assignedNodes();
        });
    }
    static get observedAttributes() {
        return [];
    }
    connectedCallback() {
        this._linkPanels();
        this.addEventListener("keydown", this._onKeyDown);
        this.addEventListener("click", this._onClick);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    get length() {
        return this._allMenus().length;
    }
    _linkPanels() {
        const menus = this._allMenus();
        const panels = this._allPanels();
        menus.forEach((menu, index) => {
            menu.index = index.toString();
        });
        panels.forEach((panel, index) => {
            panel.index = index.toString();
        });
        if (menus.length === 0) {
            return;
        }
        // The element checks if any of the tabs have been marked as selected.
        // If not, the first tab is now selected.
        const selectedTab = menus.find(menu => menu.selected) || menus[0];
        // Next, switch to the selected tab. `selectTab()` takes care of
        // marking all other tabs as deselected and hiding all other panels.
        this._selectTab(selectedTab);
    }
    _move(value) {
        const menus = this._allMenus();
        let index = __classPrivateFieldGet(this, _WHTab_lastIndex, "f");
        if (typeof value === "string") {
            if (value === "0") {
                index = 0;
            }
            if (value === "-1") {
                index = menus.length - 1;
            }
        }
        else if (typeof value === "number") {
            index += value;
            if (index < 0)
                index = 0;
            if (index >= menus.length)
                index = menus.length - 1;
        }
        this._selectTab(menus[index]);
    }
    _onKeyDown(event) {
        // If the keypress did not originate from a tab element itself,
        // it was a keypress inside the a panel or on empty space. Nothing to do.
        if (event.target.getAttribute("role") !== "tab")
            return;
        // Don’t handle modifier shortcuts typically used by assistive technology.
        if (event.altKey)
            return;
        if (event.target.parentNode !== this) {
            return;
        }
        // The switch-case will determine which tab should be marked as active
        // depending on the key that was pressed.
        switch (event.keyCode) {
            case KEYCODE.LEFT:
            case KEYCODE.UP:
                this._move(-1);
                break;
            case KEYCODE.RIGHT:
            case KEYCODE.DOWN:
                this._move(1);
                break;
            case KEYCODE.HOME:
                this._move("0");
                break;
            case KEYCODE.END:
                this._move("-1");
                break;
            // Any other key press is ignored and passed back to the browser.
            default:
                return;
        }
        // The browser might have some native functionality bound to the arrow
        // keys, home or end. The element calls `preventDefault()` to prevent the
        // browser from taking any actions.
        event.preventDefault();
    }
    _onClick(event) {
        // If the click was not targeted on a tab element itself,
        // it was a click inside the a panel or on empty space. Nothing to do.
        if (event.target.getAttribute("role") !== "tab" || event.target.parentNode !== this) {
            return;
        }
        this._selectTab(event.target);
        // If it was on a tab element, though, select that tab.
        //if (event.target.parentNode === this) {}
    }
    _selectedMenu() {
        return this.querySelector(`:scope > [selected]`);
    }
    _allPanels() {
        return Array.from(this.querySelectorAll(":scope >wh-tab-panel"));
    }
    /**
     * `_allTabs()` returns all the tabs in the tab panel.
     */
    _allMenus() {
        return Array.from(this.querySelectorAll(":scope >wh-tab-menu"));
    }
    _selectTab(menu) {
        if (__classPrivateFieldGet(this, _WHTab_lastIndex, "f") >= 0) {
            if (__classPrivateFieldGet(this, _WHTab_lastIndex, "f") === menu.index) {
                return;
            }
            dispatchEvent(this, "tab-close", { tab: this, index: __classPrivateFieldGet(this, _WHTab_lastIndex, "f") });
        }
        this.reset();
        const panel = this.querySelector(`:scope > wh-tab-panel[index="${menu.index}"]`);
        menu.selected = true;
        __classPrivateFieldSet(this, _WHTab_lastIndex, Number(menu.index), "f");
        if (panel) {
            panel.hidden = false;
        }
        dispatchEvent(this, "tab-open", { tab: this, index: menu.index });
        menu.focus();
    }
    reset() {
        const tabs = this._allMenus();
        const panels = this._allPanels();
        tabs.forEach(tab => tab.selected = false);
        panels.forEach(panel => panel.hidden = true);
    }
    addClass(className) {
        $(this).addClass(className);
    }
    removeClass(className) {
        $(this).removeClass(className);
    }
    addPage(page) {
        const menu = $(this).create("wh-tab-menu");
        const panel = $(this).create("wh-tab-panel");
        menu.append(page.menu);
        panel.append(page.panel);
        if (page.selected) {
            menu.attr("selected", true);
        }
    }
    set dataSource(dataSource) {
        this.innerHTML = "";
        if (dataSource.addClass) {
            this.addClass = dataSource.addClass;
        }
        if (dataSource.pages) {
            dataSource.pages.forEach(page => {
                this.addPage(page);
            });
        }
        if (dataSource.events) {
            for (let key in dataSource.events) {
                this.addEventListener(key, $.bind(dataSource.events[key], this, "event"));
            }
        }
    }
    set index(index) {
        const menu = this.querySelector(`:scope > wh-tab-menu[index="${index}"]`);
        this._selectTab(menu);
    }
}
_WHTab_lastIndex = new WeakMap();
customElements.define("wh-tab", WHTab);
//# sourceMappingURL=Tab.js.map