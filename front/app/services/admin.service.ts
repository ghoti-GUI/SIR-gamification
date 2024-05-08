import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { TeacherUser } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AdminService {
    private root: string;
    constructor(private http: HttpClient) {
        this.root = environment.backendUrl + "/api/admin/";
    }

    public getTeachers(): Observable<TeacherUser[]> {
        return new Observable<TeacherUser[]>((subscriber) => {
            this.http.get<TeacherUser[]>(this.root + "teachers").subscribe({
                next: (teachers: TeacherUser[]) => {
                    subscriber.next(teachers);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public deleteTeacher(id: string): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.delete<void>(this.root + "teachers/" + id).subscribe({
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

    public modifyTeacherAccess(id: string, tps: string[]): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "setTps/" + id, { tps }).subscribe({
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

    public getUserList(filter: string): Observable<TeacherUser[]> {
        return new Observable<TeacherUser[]>((subscriber) => {
            this.http.post<TeacherUser[]>(this.root + "users/", { searchString: filter }).subscribe({
                next: (users: TeacherUser[]) => {
                    subscriber.next(users);
                },
                error: (err) => {
                    console.log(err);
                    subscriber.error(err);
                },
            });
        });
    }

    public addTeacher(teacher: TeacherUser, tps: string[]): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.http.post<void>(this.root + "addTeacher/", { id: teacher.id, tps }).subscribe({
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
}
