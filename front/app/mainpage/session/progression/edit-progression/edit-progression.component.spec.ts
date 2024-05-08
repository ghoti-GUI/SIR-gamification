import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditProgressionComponent } from "./edit-progression.component";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionService } from "../../../../services/session.service";
import { GradeService } from "../../../../services/grade.service";

let sessionServiceStub: Partial<SessionService>;
let gradeServiceStub: Partial<GradeService>;

describe("EditProgressionComponent", () => {
    let component: EditProgressionComponent;
    let fixture: ComponentFixture<EditProgressionComponent>;

    beforeEach(async () => {
        window.history.pushState({ id: "1", name: "TP" }, "", "");
        await TestBed.configureTestingModule({
            imports: [EditProgressionComponent, RouterTestingModule],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: GradeService, useValue: gradeServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditProgressionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
