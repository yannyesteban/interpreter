class WHSocket extends HTMLElement {
    static get observedAttributes() {
        return ["server", "token", "auth", "reconnection", "status"];
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "socket";
        this.connect();
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log(name, oldVal, newVal);
        switch (name) {
            case "server":
                break;
            case "reconnection":
                if (Boolean(newVal)) {
                    this.disconnect();
                    this.connect();
                }
        }
    }
    set server(value) {
        if (Boolean(value)) {
            this.setAttribute("server", value);
        }
        else {
            this.removeAttribute("server");
        }
    }
    get server() {
        return this.getAttribute("server");
    }
    set status(value) {
        if (Boolean(value)) {
            this.setAttribute("status", value);
        }
        else {
            this.removeAttribute("status");
        }
    }
    get status() {
        return this.getAttribute("status");
    }
    set reconnection(value) {
        if (Boolean(value)) {
            this.setAttribute("reconnection", value);
        }
        else {
            this.removeAttribute("reconnection");
        }
    }
    get reconnection() {
        return this.getAttribute("reconnection");
    }
    connect() {
        console.log("Socket Connect");
        if (this.status === "connected") {
            console.log("websocket is active");
            return;
        }
        if (this.status === "connecting") {
            console.log("websocket is connecting");
        }
        this.disconnect();
        try {
            this.status = "connecting";
            this.ws = new WebSocket(`ws://${this.server}`);
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onerror = this.onError.bind(this);
            /*if (this.reconnection) {
              this.timer = setTimeout(() => {
                if (this.status !== "connected") {
                  console.log(new Date(),this.reconnection,
                    `Try to reconnect in ${+this.reconnection / 1000} seconds`
                  );
                  this.ws.close();
                }
              }, +this.reconnection);
            }*/
        }
        catch (e) { }
    }
    disconnect() {
        this.status = "stop";
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.ws) {
            this.ws.close();
        }
    }
    onOpen(event) {
        console.log("onOpen");
        this.status = "connected";
        this.ws.send(JSON.stringify({
            mode: "auth",
            token: "vre5t4r7tretby78t8t4557y7y5687retebryh",
        }));
    }
    onMessage(event) {
        console.log("ON message", event.data);
    }
    onClose(event) {
        console.log(event, "close");
        if (this.status === "stop") {
            console.log("stop");
            return;
        }
        this.status = "disconnected";
        if (this.reconnection) {
            console.log("reconnection", this.status);
            this.timer = setTimeout(() => {
                console.log("setTimeout", this.status);
                if (this.status !== "connected") {
                    console.log(new Date(), this.reconnection, `Try to reconnect in ${+this.reconnection / 1000} seconds`);
                    this.connect();
                }
            }, +this.reconnection);
        }
    }
    onError(event) {
        console.log(event, "error");
        console.log("Error closing Websocket");
        return;
        if (this.ws) {
            this.ws.close();
        }
        this.ws = null;
    }
    send(body) {
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
            body: Object.assign(Object.assign({}, body), { __app_request: request }),
        };
        console.log("sending", this.ws);
        this.ws.send(JSON.stringify(message));
    }
}
customElements.define("wh-socket", WHSocket);
//# sourceMappingURL=Socket.js.map