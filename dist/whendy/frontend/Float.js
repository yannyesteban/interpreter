let zIndex = 10000;
const getIndex = (index) => {
    if (index !== undefined && index > 0 && index >= zIndex) {
        return zIndex;
    }
    return ++zIndex;
};
const on = function (obj, _event, _function) {
    obj.addEventListener(_event, _function, false);
};
const off = function (obj, _event, _function) {
    obj.removeEventListener(_event, _function, false);
};
export class Float {
    constructor(config) {
        this._mousedown = (event) => {
            this.e.style.zIndex = getIndex(this.e.style.zIndex);
        };
        this._touchstart = (event) => {
            this.e.style.zIndex = getIndex(this.e.style.zIndex);
        };
        this.e = config;
        on(this.e, "mousedown", this._mousedown);
        on(this.e, "touchstart", this._touchstart);
    }
    static getBoundingPage() {
        return {
            pageWidth: document.documentElement.clientWidth,
            pageHeigh: document.documentElement.clientHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollLeft: document.documentElement.scrollLeft
        };
    }
    stop() {
        off(this.e, "mousedown", this._mousedown);
        off(this.e, "touchstart", this._touchstart);
    }
    static init(config) {
        return new Float(config);
    }
    static upIndex(e) {
        e.style.zIndex = getIndex(e.style.zIndex);
    }
    static setIndex(e) {
        e.style.zIndex = getIndex(e.style.zIndex);
    }
    static getXY(e) {
        let cW = document.documentElement.clientWidth, cH = document.documentElement.clientHeight, sT = document.documentElement.scrollTop, sL = document.documentElement.scrollLeft, rect = e.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            cW: cW, cH: cH, sT: sT, sL: sL
        };
    }
    static showElem(opt) {
        let e = opt.e, left = opt.left, top = opt.top, z = (opt.z !== undefined) ? opt.z : undefined;
        if (top !== null) {
            e.style.top = top + "px";
        }
        if (left !== null) {
            e.style.left = left + "px";
        }
        if (z !== undefined) {
            if (z > 0) {
                e.style.zIndex = z;
            }
        }
        else {
            z = e.style.zIndex = getIndex();
        }
        return { e: e, left: left, top: top, z: z };
    }
    static show(opt) {
        let e = opt.e, xx = (opt.left === undefined) ? null : opt.left, yy = (opt.top === undefined) ? null : opt.top, z = opt.z || undefined, deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, left = null, top = null;
        let c = this.getXY(opt.e);
        if (typeof xx === "string") {
            switch (xx) {
                case "center":
                    left = c.sL + (c.cW - c.width) / 2;
                    break;
                case "left":
                    left = c.sL;
                    break;
                case "right":
                    left = c.sL + c.cW - c.width;
                    break;
                case "acenter":
                    left = (c.cW - c.width) / 2;
                    break;
            }
        }
        else {
            left = xx;
        }
        if (typeof yy === "string") {
            switch (yy) {
                case "middle":
                    top = c.sT + (c.cH - c.height) / 2;
                    break;
                case "top":
                    top = c.sT;
                    break;
                case "bottom":
                    top = c.sT + c.cH - c.height;
                    break;
                case "amiddle":
                    top = (c.cH - c.height) / 2;
                    break;
            }
        }
        else {
            top = yy;
        }
        if (left !== null) {
            left = left + (deltaX || 0);
        }
        if (top !== null) {
            top = top + (deltaY || 0);
        }
        //console.log({ e: e, left: left, top: top, z: z })
        return this.showElem({ e: e, left: left, top: top, z: z });
    }
    static showMenu(opt) {
        let e = opt.e, context = opt.context, xx = opt.left || "", yy = opt.top || "", deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, z = (opt.z !== undefined) ? opt.z : undefined, left = null, top = null, c = this.getXY(context), fixed = (e.style.position === "fixed"), width = e.offsetWidth, height = e.offsetHeight, cW = c.cW, cH = c.cH, sL = c.sL, sT = c.sT;
        switch (xx) {
            case "center":
                left = c.left + c.width / 2 - width / 2;
                break;
            case "left":
                left = c.left;
                break;
            case "front":
                left = c.left + c.width;
                break;
            case "back":
                left = c.left - width;
                break;
            case "right":
                left = c.left + c.width - width;
                break;
            default:
                left = c.left + c.width - 10;
        }
        switch (yy) {
            case "middle":
                top = c.top + c.height / 2 - height / 2;
                break;
            case "top":
                top = c.top;
                break;
            case "bottom":
                top = c.top + c.height - height;
                break;
            case "down":
                top = c.top + c.height;
                break;
            case "up":
                top = c.top - height;
                break;
            default:
                top = c.top + c.height - 10;
        }
        if (!fixed) {
            top = top + sT;
            left = left + sL;
        }
        left = left + deltaX;
        top = top + deltaY;
        if ((left + width) > (cW + sL)) {
            left = cW + sL - width;
        }
        if (left < sL) {
            left = sL;
        }
        if ((top + height) > (cH + sT)) {
            top = cH + sT - height;
        }
        if (top < sT && !fixed) {
            top = sT;
        }
        return this.showElem({ e: e, left: left, top: top, z: z });
    }
    static dropDown(opt) {
        let e = opt.e, context = opt.context, xx = opt.left || "", yy = opt.top || "", deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, z = (opt.z !== undefined) ? opt.z : undefined, left = null, top = null, c = this.getXY(context), width = e.offsetWidth, height = e.offsetHeight, cW = c.cW, cH = c.cH, sL = c.sL, sT = c.sT;
        switch (xx) {
            case "center":
                left = c.left + c.width / 2;
                break;
            case "left":
                left = c.left;
                break;
            case "right":
                left = c.left + c.width;
                break;
            case "back":
                left = c.left - width;
                break;
            default:
                left = c.left + c.width - 10;
        }
        switch (yy) {
            case "middle":
                top = c.top + c.height / 2;
                break;
            case "top":
                top = c.top;
                break;
            case "bottom":
                top = c.top + c.height;
                break;
            case "up":
                top = c.top - height;
                break;
            default:
                top = c.top + c.height - 10;
        }
        left = left + deltaX;
        top = top + deltaY;
        if ((left + width) > (cW + sL)) {
            left = cW + sL - width;
        }
        if (left < sL) {
            left = sL;
        }
        if ((top + height) > (cH + sT)) {
            //top = cH + sT - height;
        }
        if (top < sT) {
            top = sT;
        }
        if ((c.top + c.height + height) > (cH + sT)) {
            top = c.top - height;
        }
        return this.showElem({ e: e, left: left, top: top, z: z });
    }
    static center(e) {
        e.style.position = "fixed";
        e.style.top = "50%";
        e.style.left = "50%";
        e.style.transform = "translate(-50%, -50%)";
    }
    static floatCenter(e) {
        let cW = document.documentElement.clientWidth, cH = document.documentElement.clientHeight;
        let rect = e.getBoundingClientRect();
        e.style.position = "fixed";
        e.style.top = "50%";
        e.style.left = "50%";
        e.style.transform = "translate(-50%, -50%)";
    }
    static move(e, left, top) {
        //e.style.position = "fixed";
        e.style.left = left;
        e.style.top = top;
    }
    static float(opt) {
        let e = opt.e, left = opt.left, top = opt.top;
        let tx = null, ty = null;
        switch (left) {
            default:
            case "center":
                e.style.left = "50%";
                tx = "-50%";
                break;
            case "left":
                e.style.left = "0%";
                tx = "0%";
                break;
            case "right":
                e.style.left = "100%";
                tx = "-100%";
                break;
        }
        switch (top) {
            default:
            case "middle":
                e.style.top = "50%";
                ty = "-50%";
                break;
            case "top":
                e.style.top = "0%";
                ty = "0%";
                break;
            case "bottom":
                e.style.top = "100%";
                ty = "-100%";
                break;
        }
        e.style.transform = "translate(" + tx + "," + ty + ")";
    }
    static max(e) {
        e.style.position = "fixed";
        e.style.top = "0%";
        e.style.left = "0%";
        e.style.width = "100%";
        e.style.height = "100%";
        e.style.border = "3px solid green";
        //e.style.transform = "translate(-50%, -50%)";
    }
}
export class Drag {
    constructor(config) {
        this.e = null;
        this.onCapture = (config) => { };
        this.onDrag = (config) => { };
        this.onRelease = (config) => { };
        this._mouseDown = (event) => {
            //console.log("start")
            if (event.changedTouches && event.changedTouches[0]) {
                event = event.changedTouches[0];
            }
            const element = this.e;
            if (event.target && event.target.classList.contains("_drag_start_")) {
                return;
            }
            element.classList.add("_drag_start_");
            const startX = event.clientX;
            const startY = event.clientY;
            const left = element.offsetLeft;
            const top = element.offsetTop;
            this.onCapture({ startX, startY, left, top });
            const drag = (event) => {
                // console.log(event.target)
                if (event.changedTouches && event.changedTouches[0]) {
                    event.preventDefault();
                    event = event.changedTouches[0];
                }
                this.onDrag({
                    x: event.clientX,
                    y: event.clientY,
                    startX,
                    startY,
                    left,
                    top,
                    deltaX: event.clientX - startX,
                    deltaY: event.clientY - startY
                });
            };
            const release = (event) => {
                //console.log("release")
                if (event.changedTouches && event.changedTouches[0]) {
                    //event.preventDefault();
                    event = event.changedTouches[0];
                }
                element.classList.remove("_drag_start_");
                off(document, "mousemove", drag);
                off(document, "mouseup", release);
                off(document, "touchmove", drag);
                off(document, "touchend", release);
                this.onRelease({
                    x: event.clientX,
                    y: event.clientY,
                    startX,
                    startY,
                    left,
                    top,
                    deltaX: event.clientX - startX,
                    deltaY: event.clientY - startY
                });
            };
            on(document, "mousemove", drag);
            on(document, "mouseup", release);
            on(document, "touchmove", drag);
            on(document, "touchend", release);
        };
        for (var x in config) {
            if (this.hasOwnProperty(x)) {
                this[x] = config[x];
            }
        }
        this.e = config.main;
        on(this.e, "mousedown", this._mouseDown);
        on(this.e, "touchstart", this._mouseDown);
    }
    stop() {
        off(this.e, "mousedown", this._mouseDown);
        off(this.e, "touchstart", this._mouseDown);
    }
    ;
    static init(config) {
        return new Drag(config);
    }
}
export class Move {
    static init(config) {
        const main = config.main;
        const hand = config.hand;
        let startLeft = 0;
        let startTop = 0;
        const minVisibleX = (config.minVisibleX !== undefined) ? config.minVisibleX : 40;
        const minVisibleY = (config.minVisibleY !== undefined) ? config.minVisibleX : 40;
        const drag = (info) => {
            let left = startLeft + info.deltaX;
            let top = startTop + info.deltaY;
            if (left <= 0) {
                left = 0;
            }
            if (top <= 0) {
                top = 0;
            }
            main.style.left = left + "px";
            main.style.top = top + "px";
            if (config.onDrag) {
                info.left = left;
                info.top = top;
                if (config.onDrag(info)) {
                    startLeft = main.offsetLeft;
                    startTop = main.offsetTop;
                }
            }
        };
        const release = (reps) => {
            const info = Float.getXY(main);
            if (info.left > info.cW - minVisibleX || info.top > info.cH - minVisibleY) {
                const left = (info.left > info.cW - minVisibleX) ? info.cW - minVisibleX : info.left;
                const top = (info.top > info.cH - minVisibleY) ? info.cH - minVisibleY : info.top;
                reps.left = left;
                reps.top = top;
                Float.move(main, left + "px", top + "px");
            }
            if (config.onRelease) {
                config.onRelease(reps);
            }
        };
        return Drag.init({
            main: hand,
            onCapture: (response) => {
                startLeft = main.offsetLeft;
                startTop = main.offsetTop;
                if (config.position) {
                    main.style.position = config.position;
                }
                if (config.onCapture) {
                    config.onCapture({ left: startLeft, top: startTop });
                }
            },
            onDrag: drag,
            onRelease: release
        });
    }
}
;
class Resize {
    constructor(config) {
        this.main = null;
        this.modeX = 0;
        this.modeY = 0;
        this._drag = [];
        for (var x in config) {
            if (this.hasOwnProperty(x)) {
                this[x] = config[x];
            }
        }
        const main = this.main;
        main.style.userSelect = "none";
        let left = 0;
        let top = 0;
        let bottom = 0;
        let right = 0;
        let width = 0;
        let height = 0;
        let viewWidth = 0;
        let viewHeight = 0;
        let minLeft = 0;
        let maxLeft = 0;
        let minRight = 0;
        let maxRight = 0;
        let minTop = 0;
        let maxTop = 0;
        let minBottom = 0;
        let maxBottom = 0;
        const capture = () => {
            const rect = main.getBoundingClientRect();
            bottom = rect.bottom;
            right = rect.right;
            left = rect.left;
            top = rect.top;
            viewWidth = document.documentElement.clientWidth;
            viewHeight = document.documentElement.clientHeight;
            width = main.offsetWidth;
            height = main.offsetHeight;
            /*
            main.style.left = left + "px";
            main.style.width = width + "px";
            main.style.top = top + "px";
            main.style.height = height + "px";
            */
            if (config.onStart) {
                config.onStart({ left, top, right, bottom, width, height });
            }
            //const clientWidth = main.clientWidth;
            //const clientHeight = main.clientHeight;
            const compute = window.getComputedStyle(main, null);
            const minWidth = (parseFloat(compute.minWidth) || 0) + (width - main.clientWidth);
            const minHeight = (parseFloat(compute.minHeight) || 0) + (height - main.clientHeight);
            const maxWidth = parseFloat(compute.maxWidth) || viewWidth;
            const maxHeight = parseFloat(compute.maxHeight) || viewHeight;
            minLeft = left - (maxWidth - width);
            maxLeft = left + (width - minWidth);
            minRight = left + minWidth;
            maxRight = right + (maxWidth - width);
            minTop = top - (maxHeight - height);
            maxTop = bottom - minHeight;
            minBottom = top + minHeight;
            maxBottom = bottom + (maxHeight - height);
        };
        const resize = ({ x, y }) => {
            if (x < 0) {
                x = 0;
            }
            if (x > viewWidth) {
                x = viewWidth;
            }
            if (y < 0) {
                y = 0;
            }
            if (y > viewHeight) {
                y = viewHeight;
            }
            let x1 = null;
            let x2 = null;
            let y1 = null;
            let y2 = null;
            if (this.modeX === 1) {
                x1 = x;
            }
            else if (this.modeX === 2) {
                x2 = x;
            }
            if (this.modeY === 1) {
                y1 = y;
            }
            else if (this.modeY === 2) {
                y2 = y;
            }
            if (x1 !== null) {
                x2 = right;
                if (x1 < minLeft) {
                    x1 = minLeft;
                }
                if (x1 > maxLeft) {
                    x1 = maxLeft;
                }
            }
            else if (x2 !== null) {
                x1 = left;
                if (x2 > maxRight) {
                    x2 = maxRight;
                }
                if (x2 < minRight) {
                    x2 = minRight;
                }
            }
            else {
                x1 = left;
                x2 = right;
            }
            if (y1 !== null) {
                y2 = bottom;
                if (y1 < minTop) {
                    y1 = minTop;
                }
                if (y1 > maxTop) {
                    y1 = maxTop;
                }
            }
            else if (y2 !== null) {
                y1 = top;
                if (y2 < minBottom) {
                    y2 = minBottom;
                }
                if (y2 > maxBottom) {
                    y2 = maxBottom;
                }
            }
            else {
                y1 = top;
                y2 = bottom;
            }
            left = x1;
            right = x2;
            top = y1;
            bottom = y2;
            width = x2 - x1;
            height = y2 - y1;
            main.style.left = left + "px";
            main.style.top = top + "px";
            main.style.width = width + "px";
            main.style.height = height + "px";
            if (config.onResize) {
                config.onResize({ left, top, right, bottom, width, height });
            }
        };
        const release = (resp) => {
            if (config.onRelease) {
                config.onRelease({ left, top, right, bottom, width, height });
            }
        };
        Resize.holders.forEach((h) => {
            const holder = document.createElement("div");
            holder.style.cssText = "position:absolute;min-height:3px;min-width:3px;z-index:10";
            holder.className = h.className;
            for (let x in h) {
                if (x === "className") {
                    continue;
                }
                holder.style[x] = h[x];
            }
            main.appendChild(holder);
            on(holder, "mousedown", (event) => {
                this.modeX = h.modeX;
                this.modeY = h.modeY;
            });
            this._drag.push(Drag.init({
                main: holder,
                context: main,
                onCapture: capture,
                onDrag: resize,
                onRelease: release
            }));
        });
    }
    stop() {
        this._drag.forEach(drag => drag.stop());
        Array.from(this.main.querySelectorAll(`:scope > div.rs`)).map(child => child.remove());
    }
    static init(config) {
        return new Resize(config);
    }
}
Resize.holders = [
    {
        className: "rs t", backgroundColor: "", cursor: "s-resize",
        left: "0", top: "0", width: "100%", height: "", margin: "-2px",
        modeX: 0, modeY: 1
    },
    {
        className: "rs r", backgroundColor: "", cursor: "e-resize",
        left: "100%", top: "0", width: "", height: "100%", margin: "-2px",
        modeX: 2, modeY: 0
    },
    {
        className: "rs b", backgroundColor: "", cursor: "n-resize",
        left: "0", top: "100%", width: "100%", height: "", margin: "-2px",
        modeX: 0, modeY: 2
    },
    {
        className: "rs l", backgroundColor: "", cursor: "w-resize",
        left: "0", top: "0", width: "", height: "100%", margin: "-2px",
        modeX: 1, modeY: 0
    },
    {
        className: "rs lt", backgroundColor: "red", cursor: "nwse-resize",
        left: "0", top: "0", width: "0.6rem", height: "0.6rem", margin: "-0.3rem",
        modeX: 1, modeY: 1
    },
    {
        className: "rs rt", backgroundColor: "", cursor: "sw-resize",
        left: "100%", top: "0", width: "0.6rem", height: "0.6rem", margin: "-0.3rem",
        modeX: 2, modeY: 1
    },
    {
        className: "rs lb", backgroundColor: "", cursor: "ne-resize",
        left: "0", top: "100%", width: "0.6rem", height: "0.6rem", margin: "-0.3rem",
        modeX: 1, modeY: 2
    },
    {
        className: "rs rb", backgroundColor: "blue", cursor: "nwse-resize",
        left: "100%", top: "100%", width: "0.6rem", height: "0.6rem", margin: "-0.3rem",
        modeX: 2, modeY: 2
    },
];
export { Resize };
//# sourceMappingURL=Float.js.map