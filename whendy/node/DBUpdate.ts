const data = {

    connection:"webcar",
    mode:"insert",
    table:"person",
    record:{
        codpersona:5,
        codempresa:9
    },

    data:{
        name:"yanny",
        last:"esteban",
        __record__:{
            codpersona:5,
            codempresa:9
        },
        __mode__: "insert"
    },
    fields : {
        "name":{
            field:"name",
            uppercase:true,
            aux:false,
            masterValue: "master_field",
            dbValue:"now()",
            lastIdValue: true,
            dataValue: "otherfield",
            modifiers :["uppper", ""],
            mtype:"C", 
            callbackSerial:"funcserial",
            rules:{
                required: true
            }
        }

    },
    details:[
        {
            table:"child",
            mode:"update",
            record:{
                id:5
            },
            fields:{
                "id":{
                    mtype:"I"
                },
                "name":{
                    mtype:"C"
                },
                "date":{
                    mtype:"D"
                }
            },
            data:[
                {
                    __mode__:1
                },
                {
                    __mode__:2
                }
            ]


        }
    ]

}

export class DBRecordField{
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

export class DBRecord{
    infoQuery;
    table;
    fieldList;
    keys;
    mode;
    record;
    fields;
    data;
    transaction:true;
    masterData;
    detail;

}

export class DBUpdate{


    connection;
    transaction;
    records;


}