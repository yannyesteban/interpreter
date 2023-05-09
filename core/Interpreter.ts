


export class Interpreter {


    constructor() {

    }

    interpret(statements) {
        try {
            for (let stmt of statements) {
                this.execute(stmt);
            }
        } catch (error) {
            //Lox.runtimeError(error);
        }
    }


    execute(stmt) {
        stmt.accept(this);
    }
   

}