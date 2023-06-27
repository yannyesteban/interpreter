import { Element } from "./element";

export interface InfoClass {
    "name": string;
    "enable": boolean;
    "file": string;
    "class": string;

}

var _class: { [name: string]: InfoClass } = {};

export function register(info: InfoClass[]) {
    info.forEach(i => {
        _class[i.name] = i;
    });
}

export async function getClass(name: string) {

    const info = _class[name];

    if(!info?.file){
        return null;
    }

    let module = await import(info.file);

    if (module[info.class]) {
        return module[info.class]
    } else {
        throw new Error("module don't exits");
    }
}
