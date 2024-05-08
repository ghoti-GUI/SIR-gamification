import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddTeacherComponent } from "./add-teacher.component";
import { AdminService } from "../../../services/admin.service";
import { SessionService } from "../../../services/session.service";
import { Observable, of } from "rxjs";

let adminServiceStub: Partial<AdminService>;
let sessionServiceStub: Partial<SessionService>;

describe("AddTeacherComponent", () => {
    sessionServiceStub = {
        fetchTPs(): Observable<string[]> {
            return of<string[]>(["TP1", "TP2"]);
        },
    };
    let component: AddTeacherComponent;
    let fixture: ComponentFixture<AddTeacherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddTeacherComponent],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: AdminService, useValue: adminServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddTeacherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
