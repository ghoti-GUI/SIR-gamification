import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { PrivateUser, User } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UserService {
    public root: string = environment.backendUrl + "/api/user/";
    private http: HttpClient;
    private user: PrivateUser;

    constructor(http: HttpClient) {
        this.http = http;
        this.user = new PrivateUser("", "", "", "", "", "");
    }

    public setUser(user: PrivateUser) {
        this.user = user;
    }

    public getCurrentUser(): Observable<PrivateUser> {
        if (this.user.id !== "") {
            return new Observable<PrivateUser>((subscriber) => {
                subscriber.next(this.user);
            });
        } else if (this.user.id === "") {
            const user = localStorage.getItem("user");
            if (user !== null) {
                this.user = JSON.parse(user);
                return new Observable<PrivateUser>((subscriber) => {
                    subscriber.next(this.user);
                });
            }
            return new Observable<PrivateUser>((subscriber) => {
                this.http.get<PrivateUser>(this.root + "me").subscribe({
                    next: (user: PrivateUser) => {
                        this.user = user;
                        localStorage.setItem("user", JSON.stringify(user));
                        subscriber.next(user);
                    },
                    error: (error) => {
                        localStorage.removeItem("user");
                        this.user = new PrivateUser("", "", "", "", "", "");
                        subscriber.error(error);
                    },
                });
            });
        }
        return new Observable<PrivateUser>((subscriber) => {
            subscriber.error();
        });
    }

    public logout(): Observable<unknown> {
        return new Observable<unknown>((subscriber) => {
            this.http.post<unknown>(environment.backendUrl + "/api/logout", {}).subscribe({
                next: (res: unknown) => {
                    subscriber.next(res);
                },
                error: (err: Error) => {
                    subscriber.error(err);
                },
                complete: () => {
                    this.user = new PrivateUser("", "", "", "", "", "");
                    localStorage.removeItem("user");
                },
            });
        });
    }

    public login(username: string, password: string) {
        return new Observable((subscriber) => {
            this.http
                .post<PrivateUser>(environment.backendUrl + "/api/login", {
                    username: username,
                    password: password,
                })
                .subscribe({
                    next: (user: PrivateUser) => {
                        this.user = user;
                        localStorage.setItem("user", JSON.stringify(user));
                        subscriber.next();
                    },
                    error: (error) => {
                        localStorage.removeItem("user");
                        this.user = new PrivateUser("", "", "", "", "", "");
                        subscriber.error(error);
                    },
                });
        });
    }

    public register(username: string, password: string, email: string, name: string, surname: string) {
        return new Observable((subscriber) => {
            this.http
                .post<PrivateUser>(environment.backendUrl + "/api/register", {
                    username: username,
                    password: password,
                    email: email,
                    name: name,
                    surname: surname,
                })
                .subscribe({
                    next: (user: PrivateUser) => {
                        this.user = user;
                        localStorage.setItem("user", JSON.stringify(user));
                        subscriber.next();
                    },
                    error: (error) => {
                        localStorage.removeItem("user");
                        this.user = new PrivateUser("", "", "", "", "", "");
                        subscriber.error(error);
                    },
                });
        });
    }

    public isAuthenticated(): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            if (this.user.id !== "") {
                return subscriber.next(true);
            }
            const user = localStorage.getItem("user");
            if (user !== null) {
                this.user = JSON.parse(user);
                return subscriber.next(true);
            }
            subscriber.next(false);
        });
    }

    public getBatch(userIds: string[]): Observable<User[]> {
        return new Observable<User[]>((subscriber) => {
            this.http.post<User[]>(this.root + "batch", { users: userIds }).subscribe((users: User[]) => {
                subscriber.next(users);
            });
        });
    }

    public getOne(userId: string): Observable<User> {
        return new Observable<User>((subscriber) => {
            this.http.get<User>(this.root + userId).subscribe((user: User) => {
                subscriber.next(user);
            });
        });
    }
}
