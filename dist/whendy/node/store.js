var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as queryString from "node:querystring";
import { cookieParse } from "./CookieHandler.js";
export class Store {
    constructor() {
        this.vreq = {};
        this.vses = {};
    }
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                this.cookie = cookieParse((_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie);
                const method = req.method.toUpperCase();
                const contentType = req.headers["content-type"] || "";
                let ct = req.headers["content-type"] || "";
                if (method == "POST") {
                    console.log("POST");
                    //res.write(req.headers["content-type"])
                    //Content-Type
                    //          application/x-www-form-urlencoded
                    const chunks = [];
                    req.on("data", (chunk) => {
                        chunks.push(chunk);
                    });
                    req.on("end", () => {
                        console.log("all parts/chunks have arrived", `--${contentType}--`);
                        const postData = Buffer.concat(chunks).toString();
                        console.log("Data: ", postData, "\n\n");
                        if (contentType == "application/json") {
                            this.vreq = Object.assign(Object.assign({}, this.vreq), JSON.parse(postData));
                        }
                        else if (contentType == "application/x-www-form-urlencoded") {
                            console.log("88888", queryString.decode(postData));
                            this.queryParams(new URLSearchParams(postData));
                        }
                        else if (contentType.includes("multipart/form-data")) {
                            throw "multipart/form-data";
                        }
                        resolve(true);
                    });
                }
                else if (req.method.toUpperCase() == "GET") {
                    let [, param] = req.url.split("?");
                    this.queryParams(new URLSearchParams(param));
                    resolve(true);
                }
            });
        });
    }
    queryParams(data) {
        for (const [key, value] of data) {
            this.vreq[key] = value;
        }
        console.log("9999", this.vreq);
    }
}
//# sourceMappingURL=store.js.map