import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccueilComponent } from "./accueil.component";
import { UserService } from "../../services/user.service";
import { Observable, of } from "rxjs";
import { PrivateUser, UserType } from "../../models/user.model";
import { SessionService } from "../../services/session.service";
import { Session, SessionStatus, TeacherSession } from "../../models/session.model";

let userServiceStub: Partial<UserService>;
let sessionServiceStub: Partial<SessionService>;
describe("AccueilComponent", () => {
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
        getAvailableSessions(): Observable<Session[] | TeacherSession[]> {
            return of<Session[]>([
                {
                    id: "1",
                    name: "test",
                    teachers: ["1"],
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
                    TP: "1",
                    status: SessionStatus.SCHEDULED,
                    indexGrades: new Map<string, number>([["1", 1]]),
                    joined: false,
                },
            ]);
        },
    };

    let component: AccueilComponent;
    let fixture: ComponentFixture<AccueilComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccueilComponent],
            providers: [
                { provide: UserService, useValue: userServiceStub },
                { provide: SessionService, useValue: sessionServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccueilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
