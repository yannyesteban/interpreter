/*import * as http from "http"
http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();

}).listen(8080);*/

import { DateUtil } from "./whendy/frontend/DateUtil.js";

const result = DateUtil.date("24/10/1975 10:22:05pm", "%d/%m/%y %h:%i:%s%p");

import { valid } from "./whendy/frontend/Valid.js";

let value = "-198";
let result2 = valid({
    
    positive:{message_:"is {=value} is not num to {=title}",}
}, value, "nombre")

console.log("....", result2.message)