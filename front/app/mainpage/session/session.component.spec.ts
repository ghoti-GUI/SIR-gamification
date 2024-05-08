import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SessionComponent } from "./session.component";
import { Observable, of } from "rxjs";
import { PrivateUser, UserType } from "../../models/user.model";
import { Session, SessionStatus, TeacherSession } from "../../models/session.model";
import { UserService } from "../../services/user.service";
import { SessionService } from "../../services/session.service";

let userServiceStub: Partial<UserService>;
let sessionServiceStub: Partial<SessionService>;

describe("SessionComponent", () => {
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
                    indexGrades: new Map<string, number>([["1", 1]]),
                    status: SessionStatus.SCHEDULED,
                    joined: false,
                },
            ]);
        },
    };

    let component: SessionComponent;
    let fixture: ComponentFixture<SessionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SessionComponent],
            providers: [
                { provide: UserService, useValue: userServiceStub },
                { provide: SessionService, useValue: sessionServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SessionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
