import { loadScript } from "./LoadScript.js";
import { loadCss } from "./LoadCss.js";

import { Q as $ } from "./Q.js";




export interface IResponse {
    id: string;
    type: string;
    data: any;
    reply?: string;
    [key: string]: any;
}

interface IElement {
    id: string;
    wc: string;
    iClass: string;
    component: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    attrs: any;
    props: any;
    data: any;
    setPanel: string;
    appendTo: string;
}

class WHLayout extends HTMLElement {
    constructor() {
        super();


    }
    public connectedCallback() {

    }
}

customElements.define("wh-layout", WHLayout);

class WHPanel extends HTMLElement {
    constructor() {
        super();


    }
    public connectedCallback() {

    }
}

customElements.define("wh-panel", WHPanel);

export class App extends HTMLElement {
    public server = "";
    public modules = [];
    public components = [];

    public _e = [];

    public token = "x.y.z";
    public sid = "energy";
    public name = "";
    public xx = "";
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ["server", "sid", "token"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log({ name, oldVal, newVal });
        this[name] = newVal;

    }

    connectedCallback() {
        console.log("Custom square element added to page.");
        this.innerHTML = "hola";
        this.initApp();
    }

    decodeResponse(data: IResponse[], requestFunctions?: (config) => void[]) {

        console.log(data);

        console.log(data);
        if(!Array.isArray(data)){
            return;
        }
        

        data.forEach((item) => {


            if (item.replayToken && requestFunctions && requestFunctions[item.replayToken]) {
                requestFunctions[item.replayToken](item.data);
                return;
            }

            if (item.iToken && requestFunctions && requestFunctions[item.iToken]) {
                requestFunctions[item.iToken](item.data);
                return;
            }

            switch (item.mode) {
                case "debug":
                    console.log(item.info);
                    break;
                case "dataForm":
                    for (let key in item.dataForm) {
                        //this.setVar(key, item.dataForm[key]);
                    }
                    break;
                case "panel":
                    break;
                case "update":
                    console.log(item)
                    this.updateElement(item)
                    break;
                case "response":
                    break;
                case "init":

                    this.initElement(item);
                    break;
                case "fragment":
                    break;
                case "message": //push, delay,
                    /*
                              this.msg = new Float.Message(item);
                                  this.msg.show({});
                                  
                                  */
                    break;
                case "notice": //push, delay,
                    break;
            }
        });
    }

    set paz(x) {
        this.xx = x;
        this.setAttribute("xx", x);
    }

    get paz() {
        return this.getAttribute("xx");
    }

    test() {

        const request = {
            confirm: "?",
            valid: true,

            data: {},
            //requestFunction : null,
            requestFunctionss: {

                getEven: (json) => { },
            },
            request: [
                {
                    type: "init",
                    element: "GTMap",
                    id: "test",
                    config: {
                        "name": "one",
                        "method": "load",
                    },
                    setPanel: "wh-body",
                    setTemplate: null,
                    replayToken: "xxx",
                },
            ],
        };

        this.go(request);

    }



    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            headers: {
                "Application-Mode": "start"
            },
            data: {
                id: this.id,
            },
            requestFunctionS: (data) => {
                data.cssSheets.forEach((sheet) => {
                    loadCss(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;



            },
            request: [],
            request2: [
                {
                    type: "init-app",
                    element: "app",
                    method: "init",
                    id: null,
                    config: {},
                    setPanel: null,
                    setTemplate: null,
                },
            ],
        };

        this.go(request);


    }

    public whenComponent(module) {


        return new Promise((resolve, reject) => {
            if (customElements.get(module.component)) {

                resolve(customElements.get(module.component));
            }

            import(module.src).then(MyModule => {

                resolve(customElements.get(module.component));

            }).catch(error => {
                reject(error);
            })

        });
    }

    updateElement(info) {

        const e = $.id(info.id);

        if (e) {
            if (info.props) {

                e.prop(info.props);
            }
        }
    }

    importModule(element) {
        const m = this.modules.find((e) => e.name == element.iClass);
        const module = this.modules.find((e) => e.component == element.wc);
        loadScript(m.src, { async: true, type: "module" }).then((info) => {

            const e = $.create(element.wc);
            e.id(element.id);
            e.prop(element.props);
            e.attr(element.attrs);
            let panel = null;
            if (element.setPanel) {
                alert(999)
                panel = $.id(element.setPanel);
                if (panel) {
                    panel.text("");
                    panel.append(e);
                    return;
                }
            }
            if (element.appendTo) {
                alert(8888)
                panel = $(element.appendTo);
                if (panel) {
                    panel.append(e);
                    return;
                }

            }

        });
    }

    initElement(element: IElement | IResponse) {

       

        const module = this.modules.find((e) => e.component == element.wc);

        if (module) {

            this.whenComponent(module).then((component) => {

               
            }).catch(error => {
                console.log(error)
            });


        }


        const e = document.getElementById(element.id);
        if(e){
            e.remove();
        }
        

        
        customElements.whenDefined(element.wc).then(() => {
            const e = $.create(element.wc);
            
            e.id(element.id);
            e.prop(element.props);
            e.attr(element.attrs);



            let panel = null;
            if (element.setPanel) {

                panel = $.id(element.setPanel);

                if (panel) {
                    panel.text("");
                    panel.append(e);
                    return;
                }
            }
            if (element.appendTo) {

                panel = $(element.appendTo);

                if (panel) {
                    panel.append(e);
                    return;
                }

            }
        });
    }

    set jsModules(jsFiles) {

        jsFiles.forEach(src => {

            loadScript(src, { async: true, type: "module" });
        })

    }

    set addClass(classes) {
        $(this).addClass(classes);
    }

    go(info) {

        console.log(info)
        let body;
        if (info.dataForm) {
        } else {
        }

        const data = Object.assign(info.data || {}, { __app_request: info.request, __app_id: this.id });

        const headers = Object.assign({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
            "SID": this.sid,
            "Application-Id": this.id,
        }, info.headers || {});
        fetch(this.server, {
            method: "post",
            headers,
            body: JSON.stringify(data),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => { })
            .then((json) => {
               
                if (info.requestFunction) {
                    console.log(json);
                    info.requestFunction(json);
                    return true;
                }
                console.log(json);
                this.decodeResponse(json, info.requestFunctions || null);
            });
    }
}

customElements.define("wh-app", App);
