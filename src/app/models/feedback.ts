import { User } from "./user";

export class Feedback {
    id!: number;
    text!:string;
    client!:User;
  
    constructor(feedback:any){
      this.id = feedback.id;
      this.text = feedback.text;
      this.client = feedback.client;
    }
  }