import { Injectable, Provider } from "@angular/core";
import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { PrivateUser } from "../models/user.model";

@Injectable()
export class SessionExpiredInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private userService: UserService,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    if (error.error.message === "Unauthorized") {
                        // clear user data from local storage
                        localStorage.removeItem("user");
                        this.userService.setUser(new PrivateUser("", "", "", "", "", ""));
                        // redirect to login page
                        this.router.navigate(["/login"]);
                    }
                }
                if (error.status === 403) {
                    if (error.error.message === "You are not allowed to access this resource") {
                        // clear user data from local storage
                        localStorage.removeItem("user");
                        this.userService.setUser(new PrivateUser("", "", "", "", "", ""));
                        // redirect to home page
                        this.router.navigate(["/home"]);
                    }
                }
                throw error;
            }),
        );
    }
}

export const SessExpiredInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: SessionExpiredInterceptor,
    multi: true,
};
