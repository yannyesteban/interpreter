import * as http from "http";
export class Whendy extends http.Server {
    constructor(opt) {
        console.log("YANNY");
        super((req, res) => {
            console.log("y");
            let data = null;
            let ct = req.headers["content-type"] || "";
            if (req.method.toUpperCase() == "POST") {
                console.log("POST");
                //res.write(req.headers["content-type"])
                //Content-Type
                //          application/x-www-form-urlencoded
                const chunks = [];
                const postData = null;
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    console.log("all parts/chunks have arrived");
                    const postData = Buffer.concat(chunks).toString();
                    console.log("Data: ", postData, "\n\n");
                    if (ct == "application/json") {
                        data = JSON.parse(postData);
                    }
                    else if (ct == "application/x-www-form-urlencoded") {
                        const parsedData = new URLSearchParams(postData);
                        data = {};
                        console.log(parsedData);
                        for (const [key, value] of parsedData) {
                            data[key] = value;
                        }
                        console.log("DataObj: ", data);
                    }
                });
            }
            else if (req.method.toUpperCase() == "GET") {
                let [, param] = req.url.split("?");
                const parsedData = new URLSearchParams(param);
                console.log("GET", parsedData);
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE");
            console.log("x");
            res.write(`{"a":"yanny"}`);
            res.write(ct);
            res.end(); //end the response
        });
        this.port = 8080;
    }
    //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    start() {
        this.listen(this.port);
    }
}
//# sourceMappingURL=whendy.js.map