class WHSocket extends HTMLElement {
    private ws: WebSocket;
    static get observedAttributes() {
        return ["server", "token", "auth"];
    }

    constructor() {
        super();
    }

    public connectedCallback() {
        this.slot = "socket";
        this.connect();
    }

    public attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case "server":
        }
    }
    set server(value) {
        if (Boolean(value)) {
            this.setAttribute("server", value);
        } else {
            this.removeAttribute("server");
        }
    }

    get server() {
        return this.getAttribute("server");
    }

    private connect() {
        try {
            this.ws = new WebSocket(`ws://${this.server}`);

            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onerror = this.onError.bind(this);
        } catch (e) {
            console.log(e);
        }
    }

    private onOpen(event) {
        console.log(event, "onOpen");
    }
    private onMessage(event) {
        console.log(event, event.data);
    }
    private onClose(event) {
        console.log(event, "close");
    }
    private onError(event) {
        console.log(event, "error");
    }

    send(body:{}) {
        document.cookie = "name=testwhendy; SameSite=None; Secure";
        
        const request = [
            {
                id: "",
                type: "element",
                element: "user",
                method: "login",
                source: "admin/login",
                config: {},
            },
        ];
        const message = {
            mode: "login",
            token: "vre5t4r7tretby78t8t4557y7y5687retebryh",

            body: { ...body, __app_request: request },
        };
        this.ws.send(JSON.stringify(message));
    }
}

customElements.define("wh-socket", WHSocket);
