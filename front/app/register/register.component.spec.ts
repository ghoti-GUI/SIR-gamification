import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterComponent } from "./register.component";
import { Observable, of } from "rxjs";
import { PrivateUser, UserType } from "../models/user.model";
import { UserService } from "../services/user.service";
import { RouterTestingModule } from "@angular/router/testing";

let userServiceStub: Partial<UserService>;
describe("RegisterComponent", () => {
    userServiceStub = {
        register(): Observable<PrivateUser> {
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
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterComponent, RouterTestingModule],
            providers: [{ provide: UserService, useValue: userServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
