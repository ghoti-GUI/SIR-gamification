import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpingBonusComponent } from "./helping-bonus.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GradeService } from "../../../services/grade.service";
import { Observable, of } from "rxjs";
import { User, UserType } from "../../../models/user.model";
import { StudentGrade } from "../../../models/grade.model";

describe("HelpingBonusComponent", () => {
    let component: HelpingBonusComponent;
    let fixture: ComponentFixture<HelpingBonusComponent>;
    const grade: StudentGrade = {
        sessionName: "test",
        tp: "kafka",
        level: 1,
        grade: 0,
        mean: 0,
        std: 0,
        coefficient: 1,
        helpedBy: [],
        progressionId: "1",
        sessionId: "1",
        bonus: 0,
    };
    const gradeServiceStub: Partial<GradeService> = {
        getBonus(): Observable<User[]> {
            return of<User[]>([
                {
                    id: "1",
                    name: "abdel",
                    surname: "taya",
                    type: UserType.STUDENT,
                },
            ]);
        },
        getUserList(): Observable<User[]> {
            return of<User[]>([
                {
                    id: "1",
                    name: "abdel",
                    surname: "taya",
                    type: UserType.STUDENT,
                },
                {
                    id: "2",
                    name: "xinyi",
                    surname: "zhao",
                    type: UserType.STUDENT,
                },
            ]);
        },
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HelpingBonusComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useFactory: () => jasmine.createSpyObj("MatDialogRef", ["close"]),
                },
                { provide: MAT_DIALOG_DATA, useValue: grade },
                { provide: GradeService, useValue: gradeServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HelpingBonusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
