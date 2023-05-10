import { Keyword, Token } from "./Token.js";


export class Interpreter {


    constructor() {

    }

    interpret(statements) {
        try {
            console.log(JSON.stringify(statements));

            for (let stmt of statements) {
                console.log("> ",stmt.expression.operator);
                let r = this.execute(stmt.expression);
                console.log(r);
            }
        } catch (error) {
            //Lox.runtimeError(error);
        }
    }


    execute(stmt) {
        stmt.accept(this);
    }
   
    visitBinaryExpr(expr: any) {
        const op = expr.tok;
        console.log("*****", expr.operator)
        switch(op){
            case Token.ADD:
                return expr.left.value + expr.right.value;
        }
    }

}