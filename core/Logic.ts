import { Lexer } from "./Lexer.js";
        import { Parser } from "./Parser.js";

        import { Resolver } from "./Resolver.js";
        import { Interpreter } from "./Interpreter.js";

export class Logic{

    private output: string = "";

    constructor(){

    }

    eval(){
        
    }

    public execute(source) {

        this.output = source;

        const lexer = new Lexer(source);

        const setions = lexer.getSections("{:",":}");
        
        const expressions = [];

        for (let s of setions){

            console.log(s)
            const parser = new Parser(s.tokens);
            const statements = parser.parse();
            const interpreter = new Interpreter();
            const resolver = new Resolver(interpreter);
            //resolver.resolve(statements);

            const output = interpreter.interpret(statements);
            s.output = output;
            console.log(output)

            
        }

        
        //console.log(expressions)
        
        return expressions;
    }
}