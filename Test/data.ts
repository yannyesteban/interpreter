import { WhSQLite } from "../whendy/node/db/wh-sqlite.js"


let db = new WhSQLite();
db.connect({
    dbase: "./whendy.db"
});

//db.execute("insert into user values (?,?,?)", ["2", "pepe", "1234"]);
(async () => {
    await db.execute("drop TABLE user_group");
    await db.execute("CREATE TABLE user_group (id integer PRIMARY KEY AUTOINCREMENT, `user` varchar(32), `group` varchar(30))");
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "admin"]);
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "super"]);
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "chief"]);
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "user"]);
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["yanny", "chief"]);
    await db.execute("insert into user_group (user, `group`) values (?,?)", ["yanny", "user"]);

    //await db.execute("drop TABLE user");
    //await db.execute("CREATE TABLE user (id integer PRIMARY KEY AUTOINCREMENT, user varchar(32), pass varchar(256))");
    //await db.execute("insert into user (user, pass) values (?,?)", ["pepe", "1234"]);
    //await db.execute("insert into user (user, pass) values (?,?)", ["yanny", "123"]);
    //console.log(await db.getData("PRAGMA table_info('user') "))


    //console.log(await db.getData(`PRAGMA database_list`))
    //console.log(await db.getData(`PRAGMA foreign_key_list(user)`))
    //console.log(await db.getData(`PRAGMA table_info('user')`)

    //console.log(await db.execute("select * from user"))
    //console.log(await db.execute("insert into user (user, pass) values (?,?)", ["yanny", "123"]));


})()



