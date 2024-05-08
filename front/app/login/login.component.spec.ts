import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { PrivateUser, UserType } from "../models/user.model";
import { UserService } from "../services/user.service";

let userServiceStub: Partial<UserService>;
describe("LoginComponent", () => {
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
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent, RouterTestingModule],
            providers: [{ provide: UserService, useValue: userServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
