export class StudentGrade {
    sessionName: string;
    tp: string;
    level: number;
    grade: number;
    bonus: number;
    mean: number;
    std: number;
    coefficient: number;
    helpedBy: string[];
    progressionId: string;
    sessionId: string;

    constructor(
        sessionName: string,
        tp: string,
        level: number,
        grade: number,
        bonus: number,
        mean: number,
        std: number,
        coefficient: number,
        helpedBy: string[],
        progressionId: string,
        sessionId: string,
    ) {
        this.sessionName = sessionName;
        this.tp = tp;
        this.level = level;
        this.grade = grade;
        this.bonus = bonus;
        this.mean = mean;
        this.std = std;
        this.coefficient = coefficient;
        this.helpedBy = helpedBy;
        this.progressionId = progressionId;
        this.sessionId = sessionId;
    }
}

export class TeacherGrade {
    progressionId: string;
    studentName: string;
    level: number;
    grade: number;
    bonus: number;
    gradeOverriden: boolean;
    gradeComment: string;

    constructor(
        progressionId: string,
        studentName: string,
        level: number,
        grade: number,
        bonus: number,
        gradeOverriden: boolean,
        gradeComment: string,
    ) {
        this.progressionId = progressionId;
        this.studentName = studentName;
        this.level = level;
        this.grade = grade;
        this.bonus = bonus;
        this.gradeOverriden = gradeOverriden;
        this.gradeComment = gradeComment;
    }
}
