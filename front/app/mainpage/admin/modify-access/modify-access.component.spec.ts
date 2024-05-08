import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ModifyAccessComponent } from "./modify-access.component";
import { AdminService } from "../../../services/admin.service";
import { SessionService } from "../../../services/session.service";
import { Observable, of } from "rxjs";
import { TeacherUser } from "../../../models/user.model";

let adminServiceStub: Partial<AdminService>;
let sessionServiceStub: Partial<SessionService>;

describe("ModifyAccessComponent", () => {
    sessionServiceStub = {
        fetchTPs(): Observable<string[]> {
            return of<string[]>(["TP1", "TP2"]);
        },
    };
    adminServiceStub = {
        getTeachers(): Observable<TeacherUser[]> {
            return of<TeacherUser[]>([
                new TeacherUser("1", "test", "test", "teacher", "test", "test@test.com", ["TP1"]),
            ]);
        },
    };

    let component: ModifyAccessComponent;
    let fixture: ComponentFixture<ModifyAccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModifyAccessComponent],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: AdminService, useValue: adminServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModifyAccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
