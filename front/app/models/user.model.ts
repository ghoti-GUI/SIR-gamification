export class User {
    id: string;
    name: string;
    surname: string;
    type: UserType;

    constructor(id: string, name: string, surname: string, type: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.type = type as UserType;
    }
}

export enum UserType {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student",
}

export class PrivateUser extends User {
    username: string;
    email: string;

    constructor(id: string, name: string, surname: string, type: string, username: string, email: string) {
        super(id, name, surname, type);
        this.username = username;
        this.email = email;
    }
}

export class TeacherUser extends User {
    tps: string[];

    constructor(
        id: string,
        name: string,
        surname: string,
        type: string,
        username: string,
        email: string,
        tps: string[],
    ) {
        super(id, name, surname, type);
        this.tps = tps;
    }
}
