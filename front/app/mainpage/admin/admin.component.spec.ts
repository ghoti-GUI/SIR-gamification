import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminComponent } from "./admin.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AdminService } from "../../services/admin.service";
import { Observable, of } from "rxjs";
import { TeacherUser } from "../../models/user.model";

let adminServiceStub: Partial<AdminService>;

describe("AdminComponent", () => {
    adminServiceStub = {
        getTeachers(): Observable<TeacherUser[]> {
            return of<TeacherUser[]>([
                new TeacherUser("1", "test", "test", "teacher", "test", "test@test.com", ["TP1"]),
            ]);
        },
    };
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminComponent, RouterTestingModule],
            providers: [{ provide: AdminService, useValue: adminServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
