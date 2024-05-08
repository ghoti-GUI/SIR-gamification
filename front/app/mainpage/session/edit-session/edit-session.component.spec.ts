import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditSessionComponent } from "./edit-session.component";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionService } from "../../../services/session.service";

let sessionServiceStub: Partial<SessionService>;

describe("EditSessionComponent", () => {
    let component: EditSessionComponent;
    let fixture: ComponentFixture<EditSessionComponent>;

    beforeEach(async () => {
        window.history.pushState(
            {
                id: "1",
                name: "TP",
                startDate: "2025-12-11T11:03:00.000Z",
                endDate: "2026-12-11T11:03:00.000Z",
                TP: "Kafka",
            },
            "",
            "",
        );
        await TestBed.configureTestingModule({
            imports: [EditSessionComponent, RouterTestingModule],
            providers: [{ provide: SessionService, useValue: sessionServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(EditSessionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
