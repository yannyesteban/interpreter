/*import * as http from "http"
http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();

}).listen(8080);*/
import  pg from "pg"
import * as my from "mysql"

import { DateUtil } from "./whendy/frontend/DateUtil.js";
import { DBUpdate } from "./whendy/node/DBUpdate.js";

const result = DateUtil.date("24/10/1975 10:22:05pm", "%d/%m/%y %h:%i:%s%p");

import { valid } from "./whendy/frontend/Valid.js";

let value = "-198";
let result2 = valid({
    
    positive:{message_:"is {=value} is not num to {=title}",}
}, value, "nombre")

console.log(" **** ", result2.message);

let f = new DBUpdate()




async function  start(){
    const client = new pg.Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'whendy',
        password: '12345678',
        port: 5432,
      })
    console.log("8888")
    await client.connect()
 
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    const res = await client.query('SELECT * FROM public.user where id=$1', [2] )
    console.log(res.rows) // Hello world!
    await client.end()
}
//start()

async function  start2(){
    var connection = my.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'gt'
      });
      connection.connect();
      
      connection.query('SELECT * FROM unit limit 10', function(err, rows, fields) 
      {
        if (err) throw err;
      
        //console.log(rows[0]);
        console.log(fields)
      });
      
      connection.end();
}
//start2()