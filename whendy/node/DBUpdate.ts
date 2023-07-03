import { DBAdmin, IRecordId, MysqlDB, PostgreDB, STMTResult } from "./db.js";


console.log("DB Update...")

const data = {

    connection: "webcar",
    mode: "insert",
    table: "person",
    record: {
        codpersona: 5,
        codempresa: 9
    },

    data: {
        name: "yanny",
        last: "esteban",
        __record__: {
            codpersona: 5,
            codempresa: 9
        },
        __mode__: "insert"
    },
    fields: {
        "name": {
            field: "name",
            uppercase: true,
            aux: false,
            masterValue: "master_field",
            dbValue: "now()",
            lastIdValue: true,
            dataValue: "otherfield",
            modifiers: ["uppper", ""],
            mtype: "C",
            callbackSerial: "funcserial",
            rules: {
                required: true
            }
        }

    },
    details: [
        {
            table: "child",
            mode: "update",
            record: {
                id: 5
            },
            fields: {
                "id": {
                    mtype: "I"
                },
                "name": {
                    mtype: "C"
                },
                "date": {
                    mtype: "D"
                }
            },
            data: [
                {
                    __mode__: 1
                },
                {
                    __mode__: 2
                }
            ]


        }
    ]

}

export class DBRecordField {
    name;
    field;
    uppercase;
    aux;
    masterValue;
    dbValue;
    lastIdValue;
    dataValue;
    expressionValue;
    modifiers;
    mtype;
    callbackSerial;
    rules;

}

export class DBRecord {
    infoQuery?;
    table?;
    fieldList?;
    keys?: any[];
    mode?;
    record?;
    fields?;
    data?;
    transaction?;
    masterData?;
    detail?;

}

export class DBUpdate {


    connection;
    transaction;
    records: DBRecord[];

    save() {
        let db;
        if (10 > 2) {
            db = new MysqlDB({
                host: "localhost",
                user: "root",
                pass: "123456",
                dbase: "whendy"
            });
        } else {
            db = new PostgreDB({
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy"
            });

        }



        //let db = new DBAdmin();

        for (let record of this.records) {
            console.log("save", record.keys)
            let serialField = null;
            const find: IRecordId = record.keys.find(e => e.type == "serial");

            if (find) {
                serialField = find.name;
            }

            for (const data of record.data) {

                const mode = data.__mode__ || record.mode;
                const recordId: IRecordId = record.keys.reduce((acc, value) => { return { ...acc, [value.name]: value } }, {});


                console.log("<", recordId, data.__mode__, ">")
                const fields = {};

                for (const [name, options] of Object.entries(record.fields)) {
                    let field = {
                        name,
                        value: data[name]
                    };

                    fields[name] = data[name];

                    if (name in recordId) {
                        recordId[name] = data[name];
                    }
                }
                let result: STMTResult;
                if (mode == 1) {
                    delete fields[serialField];
                    console.log("XXXX", serialField)
                    result = db.doInsert(record.table, fields);
                } else if (mode == 2) {
                    result = db.doUpdate(record.table, fields, data.__record__);
                } else if (mode == 3) {
                    result = db.doDelete(record.table, data.__record__);
                } else if (mode == 4) {
                    result = db.doInsertOrUpdate(record.table, fields);
                }

                if (result?.lastId && serialField) {
                    recordId[serialField] = result.lastId;
                }

                

                console.log(recordId, "...\n", fields);
            }
        }
    }
}

const db = new DBUpdate()
db.records = [
    {
        "table": "user",

        "keys": [
            {
                name: "id",
                type: "serial"
            }
        ],
        "fields": {
            "id": {},
            "user": {},
            "pass": {},
            "expire": {},
            "status": {}
        },
        data: [
            {
                id:26,
                user: "CASE 5",

                pass: 10,
                expire: "2022-11-24",
                status: 2,
                __mode__: 4,
            },
            {

                //id:2,
                user: "maria",
                pass: 12,
                expire: "2024-10-10",
                status: 1,
                __mode__: 1,
            },
            {
                id:4,
                user: "pepe500y",

                pass: "456600",
                expire: "2020-02-14",
                status: 2,
                __mode__: 2,
                __record__ : {
                    id:4
                }
            },
            {
                __mode__: 3,
                __record__ : {
                    id:31,
                    user:"yanny"
                }
            }
        ],

        detail:{
            table:"child",
            keys:["id","cod"],
            fieldInfo:{

            },
            fields:[
                {
                    field:"id",
                    type:"i",
                    realType :"INTEGER",
                    null: false,
                    serial:true,
                    primaryKey: true,
                    default:0,
                    masterValue:"master_id",
                    dbValue:"now()+1",
                    nowValue:true,
                }
            ],
            //fields:["id", "cod", "name"],
            data:[
                [1,1,1],
                [2,2,2]
            ]
        }
    }
];

db.save();