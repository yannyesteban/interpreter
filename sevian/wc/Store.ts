export const fire = (element, name, detail) => {
    const event = new CustomEvent(name, {
        detail,
    });

    element.dispatchEvent(event);
};

const _handler = (element) => {
    return {
        set(target, key, value) {
            let oldValue = target[key];
            console.log({ target, key, value, oldValue, type: typeof value });

            target[key] = value;
            let mode = "set";
            if (oldValue !== value) {
                mode = "change";
            }

            fire(element, `${String(key)}-change`, { key, value, mode });
            fire(element, "change", { key, value, mode });
            console.log(key, value);
            return true;
        },
    };
};

class Store extends HTMLElement {
    data;
    static get observedAttributes() {
        return ["type"];
    }
    constructor() {
        super();
    }

    public connectedCallback() {
        this.data = new Proxy({}, _handler(this));
    }

    add(name, value) {
        this.data[name] = value;
    }
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

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }
}

customElements.define("data-store", Store);
