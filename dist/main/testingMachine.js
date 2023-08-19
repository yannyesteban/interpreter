var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*import * as http from "http"
http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();

}).listen(8080);*/
import pg from "pg";
import * as my from "mysql";
import { DateUtil } from "../sevian/DateUtil.js";
import { DBUpdate } from "../whendyJS/db/DBUpdate.js";
const result = DateUtil.date("24/10/1975 10:22:05pm", "%d/%m/%y %h:%i:%s%p");
import { valid } from "../sevian/Valid.js";
import { Tool } from "../whendyJS/tool.js";
let value = "-198";
let result2 = valid({
    positive: { message_: "is {=value} is not num to {=title}", }
}, value, "nombre");
console.log(" **** ", result2.message);
//let f = new DBUpdate()
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg.Client({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'whendy',
            password: '12345678',
            port: 5432,
        });
        console.log("8888");
        yield client.connect();
        //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        const res = yield client.query('SELECT * FROM public.user where id=$1', [2]);
        console.log(res.rows); // Hello world!
        yield client.end();
    });
}
//start()
function start2() {
    return __awaiter(this, void 0, void 0, function* () {
        var connection = my.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'whendy'
        });
        connection.connect();
        connection.query('SELECT 4 as d FROM unit limit 10', function (err, rows, fields) {
            //if (err) throw err;
            console.log("err");
            //console.log(rows[0]);
            console.log(rows);
        });
        connection.end();
    });
}
//start2()
const config = Tool.loadJsonFile("./app/json/dbs/test.json");
const db = new DBUpdate(config);
//# sourceMappingURL=testingMachine.js.map