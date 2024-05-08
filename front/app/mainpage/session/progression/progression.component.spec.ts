import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressionComponent } from "./progression.component";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionService } from "../../../services/session.service";
import { GradeService } from "../../../services/grade.service";

let sessionServiceStub: Partial<SessionService>;
let gradeServiceStub: Partial<GradeService>;

describe("ProgressionComponent", () => {
    let component: ProgressionComponent;
    let fixture: ComponentFixture<ProgressionComponent>;

    beforeEach(async () => {
        window.history.pushState({ id: "1", name: "TP" }, "", "");
        await TestBed.configureTestingModule({
            imports: [ProgressionComponent, RouterTestingModule],
            providers: [
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: GradeService, useValue: gradeServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProgressionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
