import { Role } from "./role";

export class User {
    id!: number;
    name!: string;
    email!: string;
    phone!: string;
    password!: string
    roles!: Array<Role>;

    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.password = user.password;
        this.roles = user.roles;
    }
}