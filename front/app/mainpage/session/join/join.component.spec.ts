import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinComponent } from "./join.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Session, SessionStatus, TeacherSession } from "../../../models/session.model";

describe("JoinComponent", () => {
    let component: JoinComponent;
    let fixture: ComponentFixture<JoinComponent>;
    let session: Session | TeacherSession;

    beforeEach(async () => {
        session = {
            id: "1",
            name: "test",
            teachers: ["1"],
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
            TP: "1",
            indexGrades: new Map<string, number>([["1", 1]]),
            joined: false,
            status: SessionStatus.SCHEDULED,
        };
        await TestBed.configureTestingModule({
            imports: [JoinComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useFactory: () => jasmine.createSpyObj("MatDialogRef", ["close", "afterClosed"]),
                },
                { provide: MAT_DIALOG_DATA, useValue: session },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(JoinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
