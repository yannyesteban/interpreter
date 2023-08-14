// JavaScript Document
/*
// Add "focus" and "highlighted" classes, and then remove them
var box = document.querySelector(".box");
box.classList.add("focus", "highlighted");
box.classList.remove("focus", "highlighted");

https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/



*/
var _sg = {
    _on: function (obj, _event, _function) {
        if (obj.addEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            obj.addEventListener(_event, _function, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent(_event, _function);
        } // end if
    },
    _off: function (obj, _event, _function) {
        if (obj.removeEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            obj.removeEventListener(_event, _function, false);
        }
        else if (obj.detachEvent) {
            obj.detachEvent(_event, _function);
        } // end if
    },
    prop: function (obj, prop, value) {
        if (typeof (prop) === "object") {
            for (var x in prop) {
                obj[x] = prop[x];
            }
        }
        else if (value !== false) {
            obj[prop] = value;
        }
    },
    on: function (obj, _event, _function) {
        if (typeof (_event) === "object") {
            for (var x in _event) {
                this._on(obj, x, _event[x]);
            }
        }
        else {
            this._on(obj, _event, _function);
        }
    },
    off: function (obj, _event, _function) {
        if (typeof (_event) === "object") {
            for (var x in _event) {
                this._off(obj, x, _event[x]);
            }
        }
        else {
            this._off(obj, _event, _function);
        }
    },
};
export class SQObject {
    constructor(obj) {
        this.e = obj;
    }
    get() {
        return this.e;
    }
    create(tagName) {
        if (tagName === false) {
            return this;
        }
        return this.append(_sgQuery.create(tagName));
    }
    createFirst(tagName) {
        if (tagName === false) {
            return this;
        }
        const ele = _sgQuery.create(tagName);
        this.insertFirst(ele);
        return ele;
    }
    add(tagName) {
        this.append(_sgQuery.create(tagName));
        return this;
    }
    text(text, append) {
        if (text === undefined) {
            return this.e.innerHTML;
        }
        if (append) {
            this.e.innerHTML += text;
        }
        else {
            this.e.innerHTML = text;
        }
        return this;
    }
    id(id) {
        if (id === undefined) {
            return this.e.id;
        }
        this.e.id = id;
        return this;
    }
    val(value) {
        if (value === undefined) {
            return this.e.value;
        }
        this.e.value = value;
        return this;
    }
    value(value) {
        if (value === undefined) {
            return this.e.value;
        }
        this.e.value = value;
        return this;
    }
    append(obj) {
        if (!this.e || !this.e.appendChild || obj === false || obj === null || obj === undefined) {
            return this;
        }
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                this.e.appendChild(obj.get());
                return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.appendChild(obj);
            }
            else if (obj.get && typeof obj.get === "function") {
                this.e.appendChild(obj.get());
                return obj;
            }
            else {
                return this;
            }
        } /*else if(document.querySelector(obj)){
            this.append("error");
            obj = document.querySelector(obj);
            this.e.innerHTML = document.querySelector(obj);

        }*/
        else {
            this.e.innerHTML += obj;
            return this;
        }
        return _sgQuery(obj);
    }
    appendTo(target) {
        if (typeof (target) === "object") {
            if (target instanceof SQObject) {
                target.get().appendChild(this.e);
            }
            else if (target instanceof HTMLElement) {
                target.appendChild(this.e);
            }
        }
        return this;
    }
    insertFirst(obj) {
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                //this.e.appendChild(obj.get());
                this.e.insertBefore(obj.get(), this.e.firstChild);
                //return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.insertBefore(obj, this.e.firstChild);
            }
            else {
                //return this;
            }
        }
        else {
            this.e.innerHTML = obj + this.e.innerHTML;
        }
        return this;
        //this.e.insertBefore(obj, this.e.firstChild);
    }
    replace(obj) {
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                //this.e.appendChild(obj.get());
                this.e.replaceChild(obj.get(), this.e);
                //return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.replaceChild(obj, this.e.firstChild);
            }
            else {
                //return this;
            }
        }
        else {
            this.e.innerHTML = obj;
        }
        return this;
        //this.e.insertBefore(obj, this.e.firstChild);
    }
    addClass(className) {
        if (className) {
            if (Array.isArray(className)) {
                className.forEach(item => this.e.classList.add(item));
            }
            else if (typeof className === "string") {
                this.e.classList.add(className);
            }
        }
        return this;
    }
    removeClass(className) {
        if (className) {
            if (typeof (className) === "object") {
                for (var x in className) {
                    this.e.classList.remove(className[x]);
                }
            }
            else {
                this.e.classList.remove(className);
            }
        }
        return this;
    }
    toggleClass(className) {
        this.e.classList.toggle(className);
        return this;
    }
    hasClass(className) {
        return this.e.classList.contains(className);
    }
    attr(attr, value) {
        if (value === undefined) {
            return this.e[attr];
        }
        else {
            _sg.prop(this.e, attr, value);
            return this;
        }
    }
    prop(prop, value) {
        _sg.prop(this.e, prop, value);
        return this;
    }
    style(prop, value) {
        /*
        if(typeof(prop) === "object"){
            _sg.prop(this.e.style, prop, value);

        }

        console.log(prop+"..."+value)
        if(!prop){
            return this.e.style;
        }

        if(value === undefined){
            return this.e.style[prop];
        }
        _sg.prop(this.e.style, prop, value);
            return this;*/
        if (prop !== undefined) {
            _sg.prop(this.e.style, prop, value);
            return this;
        }
        else {
            return this.e.style;
        }
    }
    ds(prop, value) {
        if (typeof (prop) === "object") {
            _sg.prop(this.e.dataset, prop, value);
            return this;
        }
        else if (prop) {
            if (value === undefined) {
                return this.e.dataset[prop];
            }
            _sg.prop(this.e.dataset, prop, value);
            return this;
        }
        else {
            return this.e.dataset;
        }
    }
    removeDs(prop) {
        delete this.e.dataset[prop];
        return this;
    }
    query(selector) {
        if (this.e.querySelector(selector)) {
            return this.e.querySelector(selector);
        }
        return false;
    }
    queryAll(selector) {
        if (this.e.querySelectorAll(selector)) {
            return this.e.querySelectorAll(selector);
        }
        return false;
    }
    children() {
        return Array.from(this.e.children);
    }
    parent() {
        return this.e.parentNode || null;
    }
    q(selector) {
        return _sgQuery(this.e.querySelector(selector));
    }
    childs() {
        var ch = this.e.childNodes;
        var childs = [];
        for (var x = 0; x < ch.length; x++) {
            if (ch[x].nodeType === 1) {
                childs.push(ch[x]);
            }
        }
        return childs;
    }
    contains(elem) {
        if (elem instanceof HTMLElement) {
            return this.e.contains(elem);
        }
        else if (elem.get && typeof elem.get === "function") {
            return this.e.contains(elem.get());
        }
    }
    remove() {
        if (this.e) {
            this.e.remove();
        }
    }
    on(_event, _function) {
        _sg.on(this.e, _event, _function);
        return this;
        if (this.e.addEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            this.e.addEventListener(_event, _function, false);
        }
        else if (this.e.attachEvent) {
            this.e.attachEvent(_event, _function);
        } // end if
    }
    off(_event, _function) {
        _sg.off(this.e, _event, _function);
        return this;
        if (this.e.removeEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            this.e.removeEventListener(_event, _function, false);
        }
        else if (this.e.detachEvent) {
            this.e.detachEvent(_event, _function);
        } // end if
    }
    fire(_event) {
        var evt;
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(_event, true, true); // event type,bubbling,cancelable
        return !this.e.dispatchEvent(evt);
    }
}
export let SQObject1 = function (obj) {
    this.e = obj;
    /*
    if(obj === undefined || obj === ""){
        this.e = document.body;
    }else if(typeof(obj) === "object"){
        this.e = obj;
    }else if(document.querySelector(obj)){
        this.e = document.querySelector(obj);
    }else if(document.getElementById(obj)){
        this.e = document.getElementById(obj);
    }else{
        this.e = false;
    }

    */
};
SQObject1.prototype = {
    get: function () {
        return this.e;
    },
    create: function (tagName) {
        if (tagName === false) {
            return this;
        }
        return this.append(_sgQuery.create(tagName));
    },
    createFirst: function (tagName) {
        if (tagName === false) {
            return this;
        }
        const ele = _sgQuery.create(tagName);
        this.insertFirst(ele);
        return ele;
    },
    add: function (tagName) {
        this.append(_sgQuery.create(tagName));
        return this;
    },
    text: function (text, append) {
        if (text === undefined) {
            return this.e.innerHTML;
        }
        if (append) {
            this.e.innerHTML += text;
        }
        else {
            this.e.innerHTML = text;
        }
        return this;
    },
    id: function (id) {
        if (id === undefined) {
            return this.e.id;
        }
        this.e.id = id;
        return this;
    },
    val: function (value) {
        if (value === undefined) {
            return this.e.value;
        }
        this.e.value = value;
        return this;
    },
    value: function (value) {
        if (value === undefined) {
            return this.e.value;
        }
        this.e.value = value;
        return this;
    },
    append: function (obj) {
        if (!this.e || !this.e.appendChild || obj === false || obj === null || obj === undefined) {
            return this;
        }
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                this.e.appendChild(obj.get());
                return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.appendChild(obj);
            }
            else if (obj.get && typeof obj.get === "function") {
                this.e.appendChild(obj.get());
                return obj;
            }
            else {
                return this;
            }
        } /*else if(document.querySelector(obj)){
            this.append("error");
            obj = document.querySelector(obj);
            this.e.innerHTML = document.querySelector(obj);

        }*/
        else {
            this.e.innerHTML += obj;
            return this;
        }
        return _sgQuery(obj);
    },
    appendTo: function (target) {
        if (typeof (target) === "object") {
            if (target instanceof SQObject) {
                target.get().appendChild(this.e);
            }
            else if (target instanceof HTMLElement) {
                target.appendChild(this.e);
            }
        }
        return this;
    },
    insertFirst: function (obj) {
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                //this.e.appendChild(obj.get());
                this.e.insertBefore(obj.get(), this.e.firstChild);
                //return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.insertBefore(obj, this.e.firstChild);
            }
            else {
                //return this;
            }
        }
        else {
            this.e.innerHTML = obj + this.e.innerHTML;
        }
        return this;
        //this.e.insertBefore(obj, this.e.firstChild);
    },
    replace: function (obj) {
        if (typeof (obj) === "object") {
            if (obj instanceof SQObject) {
                //this.e.appendChild(obj.get());
                this.e.replaceChild(obj.get(), this.e);
                //return obj;
            }
            else if (obj instanceof HTMLElement) {
                this.e.replaceChild(obj, this.e.firstChild);
            }
            else {
                //return this;
            }
        }
        else {
            this.e.innerHTML = obj;
        }
        return this;
        //this.e.insertBefore(obj, this.e.firstChild);
    },
    addClass: function (className) {
        if (className) {
            if (typeof (className) === "object") {
                for (var x in className) {
                    if (className[x] !== false && className[x] !== null && className[x] !== "") {
                        this.e.classList.add(className[x]);
                    }
                }
            }
            else if (className !== false && className !== null && className !== "") {
                this.e.classList.add(className);
            }
        }
        return this;
    },
    removeClass: function (className) {
        if (className) {
            if (typeof (className) === "object") {
                for (var x in className) {
                    this.e.classList.remove(className[x]);
                }
            }
            else {
                this.e.classList.remove(className);
            }
        }
        return this;
    },
    toggleClass: function (className) {
        this.e.classList.toggle(className);
        return this;
    },
    hasClass: function (className) {
        return this.e.classList.contains(className);
    },
    attr: function (attr, value) {
        if (value === undefined) {
            return this.e[attr];
        }
        else {
            _sg.prop(this.e, attr, value);
            return this;
        }
    },
    prop: function (prop, value) {
        _sg.prop(this.e, prop, value);
        return this;
    },
    style: function (prop, value) {
        /*
        if(typeof(prop) === "object"){
            _sg.prop(this.e.style, prop, value);

        }

        console.log(prop+"..."+value)
        if(!prop){
            return this.e.style;
        }

        if(value === undefined){
            return this.e.style[prop];
        }
        _sg.prop(this.e.style, prop, value);
            return this;*/
        if (prop !== undefined) {
            _sg.prop(this.e.style, prop, value);
            return this;
        }
        else {
            return this.e.style;
        }
    },
    ds: function (prop, value) {
        if (typeof (prop) === "object") {
            _sg.prop(this.e.dataset, prop, value);
            return this;
        }
        else if (prop) {
            if (value === undefined) {
                return this.e.dataset[prop];
            }
            _sg.prop(this.e.dataset, prop, value);
            return this;
        }
        else {
            return this.e.dataset;
        }
    },
    removeDs: function (prop) {
        delete this.e.dataset[prop];
        return this;
    },
    query: function (selector) {
        if (this.e.querySelector(selector)) {
            return this.e.querySelector(selector);
        }
        return false;
    },
    queryAll: function (selector) {
        if (this.e.querySelectorAll(selector)) {
            return this.e.querySelectorAll(selector);
        }
        return false;
    },
    children: function () {
        return Array.from(this.e.children);
    },
    parent: function () {
        return this.e.parentNode || null;
    },
    q: function (selector) {
        return _sgQuery(this.e.querySelector(selector));
    },
    childs: function () {
        var ch = this.e.childNodes;
        var childs = [];
        for (var x = 0; x < ch.length; x++) {
            if (ch[x].nodeType === 1) {
                childs.push(ch[x]);
            }
        }
        return childs;
    },
    contains: function (elem) {
        if (elem instanceof HTMLElement) {
            return this.e.contains(elem);
        }
        else if (elem.get && typeof elem.get === "function") {
            return this.e.contains(elem.get());
        }
    },
    remove: function () {
        if (this.e) {
            this.e.remove();
        }
    },
    on: function (_event, _function) {
        _sg.on(this.e, _event, _function);
        return this;
        if (this.e.addEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            this.e.addEventListener(_event, _function, false);
        }
        else if (this.e.attachEvent) {
            this.e.attachEvent(_event, _function);
        } // end if
    },
    off: function (_event, _function) {
        _sg.off(this.e, _event, _function);
        return this;
        if (this.e.removeEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            this.e.removeEventListener(_event, _function, false);
        }
        else if (this.e.detachEvent) {
            this.e.detachEvent(_event, _function);
        } // end if
    },
    fire: function (_event) {
        var evt;
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(_event, true, true); // event type,bubbling,cancelable
        return !this.e.dispatchEvent(evt);
    },
};
export const _sgQuery = function (obj) {
    if (obj instanceof SQObject) {
        return obj;
    }
    let e = null;
    if (obj === undefined || obj === "") {
        e = document.body;
    }
    else if (typeof (obj) === "object") {
        e = obj;
    }
    else if (document.querySelector(obj)) {
        e = document.querySelector(obj);
    }
    else if (document.getElementById(obj)) {
        e = document.getElementById(obj);
    }
    if (e !== null) {
        return new SQObject(e);
    }
    return null;
};
_sgQuery.byId = function (id) {
    if (document.getElementById(id)) {
        return document.getElementById(id);
    }
    return false;
};
_sgQuery.text = function (text) {
    return _sgQuery(document.createTextNode(text));
};
_sgQuery.create = function (opt) {
    var e;
    if (typeof (opt) === "object") {
        e = document.createElement(opt.tagName);
        for (var x in opt) {
            if (opt.hasOwnProperty(x) && opt[x] !== false && opt[x] !== null) {
                if (typeof (opt[x]) === "object") {
                    this.prop(e[x], opt[x]);
                }
                else {
                    try {
                        e[x] = opt[x];
                    }
                    catch (error) {
                    }
                }
            }
        }
    }
    else {
        e = document.createElement(opt);
    }
    return _sgQuery(e);
};
_sgQuery.prop = function (obj, prop) {
    for (var x in prop) {
        if (prop.hasOwnProperty(x)) {
            obj[x] = prop[x];
        }
    }
};
_sgQuery.bind = function (fn, context, arg) {
    if (typeof (fn) === "function") {
        return fn.bind(context);
        /*
        this._main.on(x, function(){
            ME.events[x].call(ME);

        });
        */
    }
    else if (typeof (fn) === "string") {
        if (arg) {
            return Function(arg, fn).bind(context);
        }
        //function(){eval(ME.events[x])};
        //function(){Function("ME", ME.events[x]).call(this, ME);};
        //this._main.on(x, function(){Function(ME.events[x]).call(ME);});
        //this._main.on(x, Function(this.events[x]));
        return Function(fn).bind(context);
    }
};
_sgQuery.appendStyle = function (style) {
    var elem = document.createElement('style');
    elem.setAttribute("type", "text/css");
    var tn = document.createTextNode(style);
    elem.appendChild(tn);
    document.getElementsByTagName('head')[0].appendChild(elem);
};
_sgQuery.appendScript = function (script) {
    var elem = document.createElement('script');
    if (document.all) {
        elem.text = script;
    }
    else {
        var tn = document.createTextNode(script);
        elem.appendChild(tn);
    }
    document.getElementsByTagName('head')[0].appendChild(elem);
};
_sgQuery.query = function (selector) {
    if (document.querySelector(selector)) {
        return document.querySelector(selector);
    }
    return false;
};
_sgQuery.queryAll = function (selector) {
    if (document.querySelectorAll(selector)) {
        return document.querySelectorAll(selector);
    }
    return false;
};
_sgQuery.unSelect = function () {
    if (window.getSelection) {
        if (window.getSelection().empty) { // Chrome
            window.getSelection().empty();
        }
        else if (window.getSelection().removeAllRanges) { // Firefox
            window.getSelection().removeAllRanges();
        }
    }
};
/*
function a(){

    _sgQuery("#e1").fire("click");
}


var div = document.createElement("div");
var input = document.createElement("input");
div.innerHTML=".hola.";
div.style.cssText = "border:2px solid red;padding:4px;";
var s = _sgQuery("span").append(div).create("nav").append("Hola").append(" a todos y ").
create("b").text(" ??").text(" hh", true);
//db(s.get().innerHTML += " adios");

_sgQuery().create("div").text("si");


var c =_sgQuery().create("span").prop("title", "jajaja")
.style("color","green").text("no").append(_sgQuery("#e1")).text("E 01");

//document.body.appendChild(c.get());

//alert(c instanceof SQObject)

//s.append("u")
//.append(div);
var f = _sgQuery.create("div").text("Es un Body").appendTo(_sgQuery("body"));

_sgQuery("#e1").on("click", function(){alert(8);});

//f.appendTo();



*/
//export _sgQuery;
//# sourceMappingURL=Query.js.map