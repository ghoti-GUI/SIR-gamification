import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TpScrappingService {
    private root: string;
    constructor(private http: HttpClient) {
        this.root = environment.backendUrl + "/api/scrapping/";
    }

    public getLvl1Code(token: string): Observable<lvl1Code> {
        const header = new HttpHeaders().set("authorization", "Bearer " + token);
        return new Observable<lvl1Code>((subscriber) => {
            this.http.get<lvl1Code>(this.root + "lvl1", { headers: header }).subscribe((teacherInitials) => {
                subscriber.next(teacherInitials);
            });
        });
    }

    public getLvl2Course(token: string): Observable<lvl2Course> {
        const header = new HttpHeaders().set("authorization", "Bearer " + token);
        return new Observable<lvl2Course>((subscriber) => {
            this.http.get<lvl2Course>(this.root + "lvl2", { headers: header }).subscribe((course) => {
                subscriber.next(course);
            });
        });
    }

    public getLvl4TeacherInfo(token: string): Observable<lvl4Res> {
        const header = new HttpHeaders().set("authorization", "Bearer " + token);
        return new Observable<lvl4Res>((subscriber) => {
            this.http.get<lvl4Res>(this.root + "lvl4", { headers: header }).subscribe((teacherInfo) => {
                subscriber.next(teacherInfo);
            });
        });
    }

    public verifyCode(token: string, code: object, lvl: number): Observable<verifyPassCode> {
        const header = new HttpHeaders().set("authorization", "Bearer " + token);
        const root = this.root + `lvl${lvl}`;
        return new Observable<verifyPassCode>((subscriber) => {
            this.http.post<verifyPassCode>(root, code, { headers: header }).subscribe((res) => {
                subscriber.next(res);
            });
        });
    }
}

export interface lvl1Code {
    teacherInitials: string;
}
export interface lvl2Course {
    courseCode: string;
}
export interface lvl4Res {
    p1Name: string;
    p2Initials: string;
    p3Phone: string;
    p4Mail: string;
}

export interface verifyPassCode {
    success: boolean;
    progress: number;
}
