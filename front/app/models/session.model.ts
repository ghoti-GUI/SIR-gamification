export class Session {
    id: string;
    name: string;
    teachers: string[];
    startDate: Date;
    endDate: Date;
    TP: string;
    indexGrades: Map<string, number>;
    status: SessionStatus;
    joined: boolean;

    constructor(
        id: string,
        name: string,
        teachers: string[],
        startDate: Date,
        endDate: Date,
        TP: string,
        indexGrades: Map<string, number>,
        status: SessionStatus,
        joined: boolean,
    ) {
        this.id = id;
        this.name = name;
        this.teachers = teachers;
        this.startDate = startDate;
        this.endDate = endDate;
        this.TP = TP;
        this.indexGrades = new Map<string, number>(indexGrades);
        this.status = status;
        this.joined = joined;
    }

    public static compareStatus(a: Session, b: Session): number {
        if (a.status == b.status) {
            return 0;
        }
        if (a.status == SessionStatus.SCHEDULED) {
            return -1;
        }
        if (a.status == SessionStatus.INPROGRESS) {
            return b.status == SessionStatus.SCHEDULED ? 1 : -1;
        }
        if (a.status == SessionStatus.DONE) {
            return 1;
        }
        return 0;
    }
}

export class TeacherSession extends Session {
    students: string[];
    mean: number;
    std: number;

    constructor(
        id: string,
        name: string,
        teachers: string[],
        students: string[],
        startDate: Date,
        endDate: Date,
        TP: string,
        indexGrades: Map<string, number>,
        status: SessionStatus,
        mean: number,
        std: number,
    ) {
        super(id, name, teachers, startDate, endDate, TP, indexGrades, status, false);
        this.students = students;
        this.mean = mean;
        this.std = std;
    }
}

export class CreateSession {
    name: string;
    password: string;
    TP: string;
    startDate: Date;
    endDate: Date;

    constructor(name: string, password: string, TP: string, startDate: Date, endDate: Date) {
        this.name = name;
        this.password = password;
        this.TP = TP;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export enum SessionStatus {
    SCHEDULED = "scheduled",
    INPROGRESS = "inProgress",
    DONE = "done",
}
