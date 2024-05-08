import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { StudentGrade, TeacherGrade } from "../models/grade.model";
import { User } from "../models/user.model";

@Injectable({
    providedIn: "root",
})
export class GradeService {
    private root: string;
    constructor(private http: HttpClient) {
        this.root = environment.backendUrl + "/api/grade/";
    }

    public getMyGrades(): Observable<StudentGrade[]> {
        return new Observable<StudentGrade[]>((subscriber) => {
            this.http.get<StudentGrade[]>(this.root + "my").subscribe({
                next: (grades: StudentGrade[]) => {
                    subscriber.next(grades);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public getGrades(sessionId: string): Observable<TeacherGrade[]> {
        return new Observable<TeacherGrade[]>((subscriber) => {
            this.http.get<TeacherGrade[]>(this.root + "all/" + sessionId).subscribe({
                next: (grades: TeacherGrade[]) => {
                    subscriber.next(grades);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public removeGradeOverride(progressionId: string): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "resetGrade/" + progressionId, {}).subscribe({
                next: () => {
                    subscriber.next();
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }
    public setGradeOverride(progressionId: string, grade: OverrideGrade): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "setGrade/" + progressionId, grade).subscribe({
                next: () => {
                    subscriber.next();
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public setLevelGradeOverride(sessionId: string, level: OverrideLevel): Observable<TeacherGrade[]> {
        return new Observable<TeacherGrade[]>((subscriber) => {
            this.http.post<TeacherGrade[]>(this.root + "setLevelGrade/" + sessionId, level).subscribe({
                next: (nonModified) => {
                    subscriber.next(nonModified);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public removeLevelGradeOverride(sessionId: string): Observable<TeacherGrade[]> {
        return new Observable<TeacherGrade[]>((subscriber) => {
            this.http.post<TeacherGrade[]>(this.root + "removeLevelGrade/" + sessionId, {}).subscribe({
                next: (nonModified) => {
                    subscriber.next(nonModified);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public editStudentLevel(progressionID: string, level: number): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "editStudentLevel/" + progressionID, { level: level }).subscribe({
                next: () => {
                    subscriber.next();
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public getUserList(sessionId: string, filter: string): Observable<User[]> {
        return new Observable<User[]>((subscriber) => {
            this.http.post<User[]>(this.root + "students/" + sessionId, { searchString: filter }).subscribe({
                next: (users: User[]) => {
                    subscriber.next(users);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }
    public setBonus(users: User[], gradeId: string): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "setBonus/" + gradeId, { usersWithBonus: users }).subscribe({
                next: () => {
                    subscriber.next();
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }
    public getBonus(gradeId: string): Observable<User[]> {
        return new Observable<User[]>((subscriber) => {
            this.http.get<User[]>(this.root + "getBonus/" + gradeId).subscribe({
                next: (bonus: User[]) => {
                    subscriber.next(bonus);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }
}
export interface OverrideGrade {
    grade: number;
    comment: string;
}

export interface OverrideLevel {
    level: number;
    grade: number;
}
