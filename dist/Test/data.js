var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WhSQLite } from "../whendy/node/db/wh-sqlite.js";
let db = new WhSQLite();
db.connect({
    dbase: "./whendy.db"
});
//db.execute("insert into user values (?,?,?)", ["2", "pepe", "1234"]);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.execute("drop TABLE user_group");
    yield db.execute("CREATE TABLE user_group (id integer PRIMARY KEY AUTOINCREMENT, `user` varchar(32), `group` varchar(30))");
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "admin"]);
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "super"]);
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "chief"]);
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["pepe", "user"]);
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["yanny", "chief"]);
    yield db.execute("insert into user_group (user, `group`) values (?,?)", ["yanny", "user"]);
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
}))();
//# sourceMappingURL=data.js.map