import {close} from "fs";

const User = {
    method1: "",
    method2: "",
}

const Student = {
    method3: "",
    method4: ""
}


type M<T extends {}> = keyof T;


class Begin<T extends {}, S extends number = 1> {

    data: T;
    deep: S;

    constructor(data: T, s = 1 as S) {
        this.data = data;
        this.deep = s;
    }

    next(method: M<T>) {
        return this;
    }

    pop() {

    }

    push(method: M<T>) {
        return new Begin(this.data, (this.deep + 1));
    }
}

new Begin(User).next("method1").push("method2");
