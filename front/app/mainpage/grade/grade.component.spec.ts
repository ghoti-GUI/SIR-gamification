import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GradeComponent } from "./grade.component";
import { GradeService } from "../../services/grade.service";
import { Observable, of } from "rxjs";
import { StudentGrade } from "../../models/grade.model";
import { SessionService } from "../../services/session.service";
import { Session, SessionStatus } from "../../models/session.model";

describe("GradeComponent", () => {
    let component: GradeComponent;
    let fixture: ComponentFixture<GradeComponent>;
    const gradeServiceStub: Partial<GradeService> = {
        getMyGrades(): Observable<StudentGrade[]> {
            return of<StudentGrade[]>([
                {
                    sessionName: "test",
                    tp: "kafka",
                    level: 1,
                    grade: 10,
                    mean: 10,
                    std: 0,
                    coefficient: 1,
                    helpedBy: [],
                    progressionId: "1",
                    sessionId: "1",
                    bonus: 0,
                },
            ]);
        },
    };
    const sessionServiceStub: Partial<SessionService> = {
        getSession(): Observable<Session> {
            return of<Session>({
                id: "1",
                name: "test",
                teachers: [""],
                startDate: new Date("2023-12-22T15:43:00.000Z"),
                endDate: new Date("2024-01-27T09:45:00.000Z"),
                TP: "kafka",
                indexGrades: new Map<string, number>([["1", 1]]),
                status: SessionStatus.INPROGRESS,
                joined: true,
            });
        },
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GradeComponent],
            providers: [
                { provide: GradeService, useValue: gradeServiceStub },
                { provide: SessionService, useValue: sessionServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GradeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
