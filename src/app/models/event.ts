import { Color } from "./color";
import { User } from "./user";

export class Event {
    id!: number;
    title!:string;
    additional!:string;
    master!:string;
    start!:Date;
    end!:Date;
    color!:Color;
    client!:User;

    constructor(event: any) {
        this.id = event.id;
        this.title = event.title;
        this.additional = event.additional;
        this.master = event.master;
        this.start = event.start;
        this.end = event.end;
        this.color = event.color;
        this.client = event.client;
    }
}