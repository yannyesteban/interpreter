export class EvalWhen {
    data: any = {};
    constructor(data) {
        this.data = data;
    }

    eval(query) {
        if (Array.isArray(query)) {
            return this.doOr(query);
        } else if (typeof query === "object") {
            return this.doAnd(query);
        }

        return false;
    }

    doAnd(query) {
        for (const [key, value] of Object.entries(query)) {
            if (!this.cond(key, value)) {
                return false;
            }
        }

        return true;
    }

    doOr(q) {
        for (const item of q) {
            if (this.eval(item)) {
                return true;
            }
        }

        return false;
    }

    listAnd(query) {
        for (const item of query) {
            if (!this.eval(item)) {
                return false;
            }
        }

        return true;
    }

    cond(key, ref) {
        if (key == ":and") {
            return this.listAnd(ref);
        }

        if (key == ":or") {
            return this.eval(ref);
        }

        const parts = key.split(":");
        const iden = parts[0];
        const oper = parts[1];
        let value = this.data[iden];
        if (value === undefined) {
            return false;
        }

        if (typeof ref === "number") {
            value = +value;
        }

        switch (oper) {
            case ">":
                return value > ref;
            case ">=":
                return value >= ref;
            case "<":
                return value < ref;
            case "<=":
                return value <= ref;
            case "!=":
                return value != ref;
            case "=":
            case "==":
            default:
                return value == ref;
        }
    }
}
/*
const data = {
    a: 4,
    b: 1,
    c: 5,
    d: 4,
};
const cp = new EvalWhen(data);

let query: any = {};

// a=1 or (b=1 or b=3)
//const query = [{ "b:=": "a" }, { "a:=": 4 }];
// "where a>1 or (b=2 and c=5 and (s=2 or s=3))"
//query = [{"a:=":1}, {"b:=":1, "c:=":5, ":and": [{"d:=":1},{"d:=":4}] }]

//query = {":and":[{"a:!=":1}, {"a:!=":2}]}

//query = {"c":5, "b":1, ":and":[{"a:!=":1},{a:4}]}

console.log(cp.eval(query));

*/
