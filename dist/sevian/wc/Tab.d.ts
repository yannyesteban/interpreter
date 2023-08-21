declare class WHTabMenu extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(): void;
    set selected(value: boolean);
    get selected(): boolean;
    set index(index: string);
    get index(): string;
}
declare class WHTabPanel extends HTMLElement {
    constructor();
    connectedCallback(): void;
    set index(index: string);
    get index(): string;
}
export declare class WHTab extends HTMLElement {
    #private;
    constructor();
    static get observedAttributes(): any[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    get length(): number;
    _linkPanels(): void;
    _move(value: string | number): void;
    _onKeyDown(event: any): void;
    _onClick(event: any): void;
    _selectedMenu(): Element;
    _allPanels(): WHTabPanel[];
    /**
     * `_allTabs()` returns all the tabs in the tab panel.
     */
    _allMenus(): WHTabMenu[];
    _selectTab(menu: any): void;
    reset(): void;
    addClass(className: any): void;
    removeClass(className: any): void;
    addPage(page: any): void;
    set dataSource(dataSource: any);
    set index(index: number);
}
export {};
