import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Hacky way to prevent the navbar from showing for a split second when loading a page that doesn't require authentication
@Injectable({
    providedIn: "root",
})
export class LoadingService {
    private _loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public loading$ = this._loading.asObservable();

    public setLoading(loading: boolean) {
        this._loading.next(loading);
    }

    constructor() {}
}
