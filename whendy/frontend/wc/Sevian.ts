import { loadScript } from "./../LoadScript.js";
import { loadCss } from "./../LoadCss.js";

import { Q as $ } from "./../Q.js";


export type selector = string;

interface PanelInfo {
    panel: string;
    id: string;
    element: string;
    method: string;
    mode: string;
    eparams: any;
}
interface AppAction {
    id?: string;
    setPanel?: string;
    type?: string;
    element?: string;
    name?: string;
    source?: string;
    method?: string;
    eparams?: object;
    resToken?: string;
}
interface AppRequest {
    method?:string;
    headers?:{};
    type?: string;
    panel?: selector;
    confirm?: string;
    valid?: boolean;
    form?: selector | HTMLFormElement;
    body?: object;
    header?: { [key: string]: string };
    actions: AppAction[];
}

interface HtmlFragment {}

interface ElementResponse {
    setPanel?: string;
    setTo?: selector;
    appendTo?: selector;
    type?: string;
    id?: string;
    mode?: string;
    element: string;
    props: any;
    attrs: any;
    html: string;
    text: string;
    css: string;
    script: string;
}

export interface IForm {
    getValues(): any;
    isValid(arg?: any): boolean;
}

interface FetchInfo {
    method?: string;
    mode?: string;
    headers?;
    body?;
}
interface RequestInfo {
    method?: string;
    mode?: string;
    sendTo?: selector;
    dataForm?;
    request?;
    headers?;
    body?;
    requestFunctions?;
    requestFunction?;
    blockWhile?: selector[];
    confirm?: string;
    valid: any;
}

export interface IResponse {
    id: string;
    type: string;
    data: any;
    reply?: string;
    [key: string]: any;
}

interface IElement {
    id: string;
    element: string;
    iClass: string;
    component: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    attrs: any;
    props: any;
    propertys:any,
    data: any;
    setPanel: string;
    appendTo: string;
}

class Sevian extends HTMLElement {

    modules = [
        {
            "src": "./Html.js",
            "name": "Html",
            "alias": "Html",
            "component": "wh-html"
        }];

    static get observedAttributes() {
        return ["server"];
    }
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
			<style>
			:host {
				display:block;

			}
			</style><slot></slot>`;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }

    public connectedCallback() { }

    public disconnectedCallback() { }

    public attributeChangedCallback(name, old, value) {
        switch (name) {
            case "server":
                this.initApp();
                break;
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

    set token(value) {
        if (Boolean(value)) {
            this.setAttribute("token", value);
        } else {
            this.removeAttribute("token");
        }
    }

    get token() {
        return this.getAttribute("token");
    }

    isValidElement(element){
        return new Promise((resolve, reject)=>{

            customElements.whenDefined(element).then(() => {
                resolve(true)
            }).catch(error=>{
                resolve(true)
            })
        });
    }

    whenComponent(module) {
        return new Promise((resolve, reject) => {
            if (customElements.get(module.component)) {
                console.log("   A   ", module.component);

                resolve(customElements.get(module.component));
            }

            import(module.src)
                .then((MyModule) => {
                    console.log("   B   ", MyModule);
                    resolve(customElements.get(module.component));
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    setElement(info: IElement | IResponse) {
        console.log("initElement", info, this.modules);

        const module = this.modules.find((e) => e.component == info.data.element);

        if (module) {
            console.log("initElement", info);
            this.whenComponent(module)
                .then((component) => {})
                .catch((error) => {
                    console.log(error);
                });
        }

        const e = document.getElementById(info.id);
        if (e) {
            e.remove();
        }

        customElements.whenDefined(info.data.element).then(() => {
            const e = $.create(info.data.element);
            console.log(info)
            e.id(info.id);
            e.prop(info.data.propertys);
            //e.attr(info.attrs);

            let panel = null;
            if (info.setPanel) {
                panel = $(info.setPanel);

                if (panel) {
                    panel.text("");
                    panel.append(e);

                    return;
                }
            } else if (info.appendTo) {
                panel = $(info.appendTo);

                if (panel) {
                    panel.append(e);
                    return;
                }
            }
        }).catch(error=>{
            console.log(error)
        });
    }

    updateElement(info) {

        console.log("updateElement", info, document.getElementById(info.id));
        const e = $.id(info.id);
        
        if (e) {
            
            if (info.data.propertys) {
                e.prop(info.data.propertys);
            }
        }
    }
    evalResponse(response:any[]){

        console.log(response)
        response.forEach(r=>{
            switch(r.type){
                case "set":
                    console.log(r)
                    this.setElement(r);
                    break;
                case "element":
                    

                    if(r.data.element){
                        customElements.whenDefined(r.data.element).then(() => {
                            this.updateElement(r);
                        }).catch(error=>{
                            this.updateElement(r);
                        })
                    }else{
                        this.updateElement(r);
                    }
                    
                    
                    break;
            }
        })

        return true;

    }
    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            headers: {
                "Application-Name": this.name,
            },
            data: {
                id: this.id,
            },

            
            actions: [
                {
                    "type":"property",
                    
                    "element": "form",
                    "name": "city",
                    "mode":"property",
                    "id":"x",
                    "property":"dataSource"
                    
                },
            ],
        };

        const info: any = {},
            store: any = {
                myName:"Yanny"
            };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
            //SID: "this.sid",
            "Application-Name": this.name,
            "Application-Mode": info.mode,
        };

        fetch(this.server, {
            method: info.method || "post",
            headers: { ...headers, ...info.headers },
            body: JSON.stringify({ __app_request: request.actions,  __app_store: store }),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            })
            .then((json) => {
                this.evalResponse(json);
            });
    }
}

customElements.define("sevian-app", Sevian);

