import { DBAdmin, IDBAdmin, IRecordId, MysqlDB, PostgreDB, SQLiteDB, STMTResult } from "./db.js";


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

    db: IDBAdmin;

    constructor() {
        let db: IDBAdmin;
        let driver = "mysql";
        if (driver == "mysql") {
            db = new MysqlDB({
                host: "localhost",
                user: "root",
                pass: "123456",
                dbase: "whendy"
            });
        } else if (driver == "postgres") {
            db = new PostgreDB({
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy"
            });

        } else if (driver == "sqlite") {
            db = new SQLiteDB({
                host: "localhost",
                user: "postgres",
                pass: "12345678",
                dbase: "whendy"
            });
        }

        this.db = db;
    }
    save(records: DBRecord[], master?: {}) {


        const db = this.db;


        //let db = new DBAdmin();

        for (let record of records) {
            console.log("save", record.keys)
            let serialField = null;
            const find: IRecordId = record.fields.find(e => e.serial);
            const keys = record.fields.filter(e => e.key)

            if (find) {
                serialField = find.name;
            }

            for (const data of record.data) {

                const mode = data.__mode__ || record.mode;
                let result: STMTResult;

                if (mode == 3) {
                    result = db.deleteRecord({
                        "table": record.table,

                        "record": data.__record__


                    });

                    continue;
                }
                const recordId: IRecordId = keys.reduce((acc, value) => { return { ...acc, [value.name]: value } }, {});


                console.log("<", recordId, data.__mode__, ">")
                const newData = {};


                for (const field of record.fields) {
                    const name = field.name;
                    let value = data[name]
                    if (name in recordId) {
                        recordId[name] = value;
                    }
                    console.log("1 .*******************", master)

                    if (!value) {
                        console.log("2. *******************", field, master)
                        if (field.masterValue && field.masterValue in master) {
                            console.log("3.0 *******************")
                            value = master[field.masterValue];
                        } else if (field.default) {
                            value = field.default;
                        } else if (field.type == "C") {
                            value = "";
                        } else {
                            continue;
                        }

                    }

                    if (field.modifiers) {
                        for (const m of field.modifiers) {
                            switch (m) {
                                case "upper":
                                    value = String(value).toLocaleUpperCase();
                                    break;
                                case "lower":
                                    value = String(value).toLocaleLowerCase();
                                    break;
                            }
                        }
                    }

                    newData[name] = value;
                }

                if (mode == 1) {
                    //delete fields[serialField];
                    console.log("XXXX", serialField)
                    result = db.insertRecord({
                        "table": record.table,
                        "serial": serialField,
                        "data": newData,

                    });
                    //result = db.doInsert(record.table, fields);
                } else if (mode == 2) {
                    result = db.updateRecord({
                        "table": record.table,
                        "serial": serialField,
                        "data": newData,
                        "record": data.__record__,

                    },);
                    //result = db.doUpdate(record.table, newData, data.__record__);
                } else if (mode == 4) {
                    result = db.upsertRecord({
                        "table": record.table,
                        "serial": serialField,
                        "data": newData,


                    },);
                    //result = db.doInsertOrUpdate(record.table, newData);
                }

                if (result?.lastId && serialField) {
                    recordId[serialField] = result.lastId;
                }



                console.log(recordId, "...\n", newData);

                if (data.__detail__) {
                    console.log("master ", data)
                    this.save(data.__detail__, data)
                }
            }

            
        }
    }
}

const db = new DBUpdate()
db.records = [
    {
        "table": "user",
        "fields": [
            {
                "name": "id",
                "type": "I",
                "key": true,
                "serial": true,
                "notNull": true,
                "default": "",
            },
            {
                "name": "user",
                "modifiers": ["lower"]
            },
            {
                "name": "pass"
            },

            {
                "name": "expire",

            },
            {
                "name": "status",

            }
        ],

        data: [
            {

                __mode__: 3,
                __record__: {
                    id: 40
                }
            },
            {
                id: 21,
                user: "Upsert 22",
                pass: "9999",
                expire: "2023-07-03",
                status: 8,
                __mode__: 4,
            },
            {
                //id: 2,
                user: "CASE 777",
                pass: "2242",
                expire: "2024-11-24",
                status: 2,
                __mode__: 1,
                __detail__: [
                    {
                        table: "user_role",
                        keys: ["id", "cod"],
                        fieldInfo: {

                        },
                        fields: [
                            {
                                "name": "id",
                                "type": "I",
                                "key": true,
                                "serial": true,
                                "notNull": true,
                                "default": "",
                            },
                            {
                                name: "user",
                                masterValue: "user"
                            },
                            {
                                name: "rol"
                            },
                            {
                                name: "status"
                            }
                        ],
                        //fields:["id", "cod", "name"],
                        data: [
                            {


                                role: "admin",
                                user : null,
                                status: 8,
                                __mode__: 1,
                            },
                        ]
                    }
                ]
            },
            {


                id: 4,
                user: "pepe grillo III",
                pass: "77889",
                expire: "2024-10-10",
                status: 1,
                __mode__: 2,
                __record__: {
                    id: 4
                }
            }
        ],

        detail: {
            table: "user_role",
            keys: ["id", "cod"],
            fieldInfo: {

            },
            fields: [
                {
                    "name": "id",
                    "type": "I",
                    "key": true,
                    "serial": true,
                    "notNull": true,
                    "default": "",
                },
                {
                    name: "user",
                    masterValue: "user"
                },
                {
                    name: "rol"
                },
                {
                    name: "status"
                }
            ],
            //fields:["id", "cod", "name"],
            data: [
                {


                    role: "admin",

                    status: 8,
                    __mode__: 1,
                },
            ]
        }
    }
];


const recordInfo = {
    table: "user",
    key: [""],
    unique: [""],
    serial: "",
    data: [],

}

let h = {
    "name": "data1",
    "table": "user",
    "unique": ["name"],
    "key": [],
    "serial": "id",

    data: [
        {

            "user": "joe",
            "pass": "456789",
            "expire": "2004-01-01",
            "status": 1,

        }
    ],
    data1: [
        1, 1, 1, 2, null

    ]
};

db.save(db.records);