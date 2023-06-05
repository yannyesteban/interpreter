export class Store{

    level = -1;
    public scope:number[] = []

    open(){


        this.scope.push(this.level);
        this.level++
    }

}