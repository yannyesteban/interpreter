export function evaluate(regex, string, data, numeric) {
    return string.replace(regex, (str, index, p2, offset, s) => {
        let levels = index.split(".");
        let tempData = data;
        let valid = true;
        levels.forEach((key) => {
            if (valid && tempData[key] !== undefined && tempData[key] === null) {
                tempData = "";
                valid = false;
            }
            else if (valid && tempData[key] !== undefined) {
                tempData = tempData[key];
                valid = true;
            }
            else {
                valid = false;
            }
        });
        if (valid) {
            if (numeric && Number.isNaN(+tempData)) {
                return `"${tempData}"`;
            }
            return tempData;
        }
        return str;
    });
    return string;
}
export function evalExp(string, data) {
    const regex = /\{=([a-z0-9-_\.]+)\}/gi;
    return evaluate(regex, string, data);
}
export function evalJson(string, data) {
    const regex = /"\{#([a-z0-9-_\.\s]+)\}"/gi;
    return evaluate(regex, string, data, true);
}
export function evalAll(string, data) {
    return evalJson(evalExp(string, data), data);
}
export function test() {
    const data = {
        name: "John",
        "who is": "Mr",
        lastName: "Snow",
        info: {
            age: "35",
        },
        page: 4
    };
    console.log("Data", data);
    let str = "my name is {=name} {=lastName}";
    console.log(str, evalAll(str, data));
    str = "my name is {=name} {=lastName}, i am {=info.age} ";
    console.log(str, evalAll(str, data));
    const json = {
        page: "{#page}"
    };
    console.log(json, "\n", evalJson(JSON.stringify(json), data));
}
//# sourceMappingURL=Eval.js.map