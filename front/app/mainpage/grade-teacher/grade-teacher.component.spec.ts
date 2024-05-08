import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GradeTeacherComponent } from "./grade-teacher.component";
import { Observable, of } from "rxjs";
import { Session, SessionStatus, TeacherSession } from "../../models/session.model";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { PrivateUser, UserType } from "../../models/user.model";

let sessionServiceStub: Partial<SessionService>;
let userServiceStub: Partial<UserService>;

describe("GradeTeacherComponent", () => {
    sessionServiceStub = {
        getAllSessions(): Observable<Session[] | TeacherSession[]> {
            return of<Session[]>([
                {
                    id: "1",
                    name: "test",
                    teachers: ["1"],
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
                    TP: "1",
                    indexGrades: new Map<string, number>(),
                    status: SessionStatus.SCHEDULED,
                    joined: true,
                },
            ]);
        },
    };
    userServiceStub = {
        getCurrentUser(): Observable<PrivateUser> {
            return of<PrivateUser>({
                id: "1",
                username: "test",
                email: "abc@test.com",
                name: "test",
                surname: "test",
                type: UserType.STUDENT,
            });
        },
    };

    let component: GradeTeacherComponent;
    let fixture: ComponentFixture<GradeTeacherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GradeTeacherComponent],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: UserService, useValue: userServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GradeTeacherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
