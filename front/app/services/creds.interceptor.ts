import { Injectable, Provider } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class CredsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<unknown>, next: HttpHandler) {
        const newReq = req.clone({ withCredentials: true });
        return next.handle(newReq);
    }
}

export const CredsInterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: CredsInterceptor,
    multi: true,
};
