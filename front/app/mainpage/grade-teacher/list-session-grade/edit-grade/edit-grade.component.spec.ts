import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditGradeComponent } from "./edit-grade.component";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionService } from "../../../../services/session.service";
import { GradeService } from "../../../../services/grade.service";

let sessionServiceStub: Partial<SessionService>;
let gradeServiceStub: Partial<GradeService>;

describe("EditGradeComponent", () => {
    let component: EditGradeComponent;
    let fixture: ComponentFixture<EditGradeComponent>;

    beforeEach(async () => {
        window.history.pushState({ id: "1", name: "TP" }, "", "");
        await TestBed.configureTestingModule({
            imports: [EditGradeComponent, RouterTestingModule],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: GradeService, useValue: gradeServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditGradeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
