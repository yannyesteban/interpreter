import * as fs from 'fs';

export enum LoadMode {
	TEXT = 1, // main
	JSON,
	ARRAY
}

export class Tool{


    static loadJsonFile(name: string){
        return this.loadFile(name, LoadMode.JSON);
    }

    static loadFile(name: string, mode?: LoadMode){
        
        let source = fs.readFileSync(name , "utf8");
            if (!source) {
                console.error(source);
                return "error";
            }
            
            switch(mode){
                case LoadMode.JSON:
                    return JSON.parse(source);
                default:
                    return source;

            }
        
    }


}