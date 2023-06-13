export function cookieParse(str) {
    if (!str) {
        return;
    }
    let lines = str.split(";");
    let key = null;
    let value = null;
    const cookies = [];
    for (let l of lines) {
        let aux = l.split("=");
        key = aux[0].trim();
        value = decodeURIComponent(aux[1]).trim() || key;
        cookies[key] = new CookieVar(key, value);
    }
    return cookies;
}
export class CookieVar {
    constructor(name, value, domain, path, expires, secure, httpOnly, sameSite) {
        this.secure = false;
        this.httpOnly = false;
        this.name = name;
        this.value = value;
        this.domain = domain;
        this.path = path;
        this.expires = expires;
        this.secure = secure;
        this.httpOnly = httpOnly;
        this.sameSite = sameSite;
    }
    get() {
        const keys = ["name", "domain", "path", "expires", "secure", "httpOnly", "sameSite"];
        const result = [];
        keys.forEach(key => {
            if (typeof this[key] === "boolean") {
                result.push(key);
            }
            else if (key == "name") {
                result.push(this[key] + "=" + this.value);
            }
            else if (this[key]) {
                result.push(key + "=" + this[key]);
            }
        });
        return result.join(";");
    }
    getValue() {
        return this.value;
    }
}
export class CookieHandler {
    constructor(req, res) {
        var _a;
        this.result = [];
        this.cookies = {};
        this.req = req;
        this.res = res;
        const cookies = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie;
        if (!cookies) {
            return;
        }
        let lines = cookies.split(";");
        let key = null;
        let value = null;
        for (let l of lines) {
            let aux = l.split("=");
            key = aux[0].trim();
            value = aux[1].trim() || key;
            this.cookies[key] = new CookieVar(key, value);
        }
        console.log(this.cookies);
    }
    add(cookie) {
        this.cookies[cookie.name] = cookie;
    }
    get(name) {
        return this.cookies[name];
    }
    has(name) {
        return name in this.cookies;
    }
    toArray() {
        const keys = Object.keys(this.cookies);
        const result = [];
        keys.forEach(key => {
            result.push(this.cookies[key].get());
        });
        return result;
    }
    setCookie(cookie) {
        //this.result.push(cookie);
        this.res.setHeader('Set-Cookie', [cookie]);
    }
}
//# sourceMappingURL=CookieHandler.js.map