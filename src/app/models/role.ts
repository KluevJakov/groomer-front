export class Role {
    id!: number;
    name!: string;

    constructor(role: any) {
        this.id = role.id;
        this.name = role.name;
    }
}