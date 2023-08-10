export interface InfoClass {
    name?: string;
    enable?: boolean;
    file?: string;
    class?: string;
    fileConfig?: boolean;
    template?: string;
}

export class ClassManager {
    private classes: { [name: string]: InfoClass } = {};

    constructor(info: InfoClass[]) {
        info.forEach((i) => {
            this.classes[i.name] = i;
        });
    }

    register(name, info: InfoClass) {
        this.classes[name] = info;
    }

    async getClass(name: string) {
        const info = this.classes[name];
    
        if (!info?.file) {
            return null;
        }
    
        let module = await import(info.file);
    
        if (module[info.class]) {
            return module[info.class];
        } else {
            throw new Error("module don't exits");
        }
    }
    
    template(name: string) {
        return this.classes[name].template;
    }
    
    useFileConfig(name) {
        return this.classes[name]?.fileConfig ? true : false;
    }
}



